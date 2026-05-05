import * as BABYLON from '@babylonjs/core';
import { Player } from '../entities/Player';
import { EnemyManager } from '../entities/EnemyManager';
import { CombatSystem } from '../systems/CombatSystem';
import { UIManager } from '../ui/UIManager';
import { InputManager } from './InputManager';

export class Game {
    private canvas: HTMLCanvasElement;
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private camera: BABYLON.UniversalCamera;
    
    private player!: Player;
    private enemyManager!: EnemyManager;
    private combatSystem!: CombatSystem;
    private uiManager!: UIManager;
    private inputManager!: InputManager;
    
    private deltaTime: number = 0;
    private lastFrameTime: number = 0;

    constructor() {
        const canvasElement = document.getElementById('renderCanvas');
        if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
            throw new Error('Canvas element not found');
        }
        this.canvas = canvasElement;
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.collisionsEnabled = true;
        
        // Configuration de la caméra
        this.camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(0, 15, -25), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.camera.speed = 0;
        this.camera.inertia = 0.8;
        this.camera.angularSensibility = 1000;
        
        // Lighting - Plus lumineux et naturel
        const hemisphericLight = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(0.5, 1, 0.5), this.scene);
        hemisphericLight.intensity = 1.3;
        hemisphericLight.diffuse = new BABYLON.Color3(0.9, 0.9, 1);
        hemisphericLight.groundColor = new BABYLON.Color3(0.5, 0.7, 0.5);
        
        const sunLight = new BABYLON.PointLight('sunLight', new BABYLON.Vector3(50, 50, 50), this.scene);
        sunLight.intensity = 0.8;
        sunLight.range = 200;
        
        // Créer le paysage
        this.createLandscape();
        
        // Skybox
        this.createSkybox();
        
        // Initialiser les systèmes de jeu
        this.initializeSystems();
    }

    private createLandscape(): void {
        // Sol principal avec herbe
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 100, height: 100, subdivisions: 50 }, this.scene);
        const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', this.scene);
        groundMaterial.emissiveColor = new BABYLON.Color3(0.4, 0.6, 0.3);
        ground.material = groundMaterial;
        ground.position.y = -0.5;
        
        // Arène de combat au centre
        const arena = BABYLON.MeshBuilder.CreateGround('arena', { width: 60, height: 60 }, this.scene);
        const arenaMaterial = new BABYLON.StandardMaterial('arenaMaterial', this.scene);
        arenaMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.4);
        arena.material = arenaMaterial;
        arena.position.y = 0.05;
        
        // Murs de l'arène
        const wallMaterial = new BABYLON.StandardMaterial('wallMaterial', this.scene);
        wallMaterial.emissiveColor = new BABYLON.Color3(0.6, 0.4, 0.3);
        
        const wallNorth = BABYLON.MeshBuilder.CreateBox('wallNorth', { width: 60, height: 3, depth: 2 }, this.scene);
        wallNorth.position = new BABYLON.Vector3(0, 1.5, -30);
        wallNorth.material = wallMaterial;
        
        const wallSouth = BABYLON.MeshBuilder.CreateBox('wallSouth', { width: 60, height: 3, depth: 2 }, this.scene);
        wallSouth.position = new BABYLON.Vector3(0, 1.5, 30);
        wallSouth.material = wallMaterial;
        
        const wallEast = BABYLON.MeshBuilder.CreateBox('wallEast', { width: 2, height: 3, depth: 60 }, this.scene);
        wallEast.position = new BABYLON.Vector3(30, 1.5, 0);
        wallEast.material = wallMaterial;
        
        const wallWest = BABYLON.MeshBuilder.CreateBox('wallWest', { width: 2, height: 3, depth: 60 }, this.scene);
        wallWest.position = new BABYLON.Vector3(-30, 1.5, 0);
        wallWest.material = wallMaterial;
        
        // Décoration - Arbres
        this.createTrees();
        
        // Décoration - Rochers
        this.createRocks();
    }
    
    private createTrees(): void {
        const treePPositions = [
            { x: -40, z: -40 },
            { x: 40, z: -40 },
            { x: -40, z: 40 },
            { x: 40, z: 40 },
            { x: 0, z: -45 },
            { x: 0, z: 45 }
        ];
        
        treePPositions.forEach(pos => {
            // Tronc
            const trunk = BABYLON.MeshBuilder.CreateCylinder('trunk', { height: 5, diameter: 0.8 }, this.scene);
            trunk.position = new BABYLON.Vector3(pos.x, 2.5, pos.z);
            const trunkMaterial = new BABYLON.StandardMaterial('trunkMat', this.scene);
            trunkMaterial.emissiveColor = new BABYLON.Color3(0.4, 0.2, 0.1);
            trunk.material = trunkMaterial;
            
            // Feuillage
            const foliage = BABYLON.MeshBuilder.CreateSphere('foliage', { diameter: 6, segments: 16 }, this.scene);
            foliage.position = new BABYLON.Vector3(pos.x, 6.5, pos.z);
            const foliageMaterial = new BABYLON.StandardMaterial('foliageMat', this.scene);
            foliageMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.5, 0.2);
            foliage.material = foliageMaterial;
        });
    }
    
    private createRocks(): void {
        const rockPositions = [
            { x: -35, z: 0 },
            { x: 35, z: 0 },
            { x: 0, z: -35 },
            { x: 0, z: 35 },
            { x: -20, z: -20 },
            { x: 20, z: -20 },
            { x: -20, z: 20 },
            { x: 20, z: 20 }
        ];
        
        rockPositions.forEach((pos, index) => {
            const rock = BABYLON.MeshBuilder.CreateSphere('rock' + index, { diameter: 1.5, segments: 8 }, this.scene);
            rock.position = new BABYLON.Vector3(pos.x, 0.75, pos.z);
            const rockMaterial = new BABYLON.StandardMaterial('rockMat' + index, this.scene);
            rockMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
            rock.material = rockMaterial;
        });
    }

    private createSkybox(): void {
        const skybox = BABYLON.MeshBuilder.CreateBox('skybox', { size: 300 }, this.scene);
        const skyboxMaterial = new BABYLON.StandardMaterial('skyboxMaterial', this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.emissiveColor = new BABYLON.Color3(0.6, 0.8, 1);
        skybox.material = skyboxMaterial;
    }

    private initializeSystems(): void {
        // Créer le joueur
        this.player = new Player(this.scene, new BABYLON.Vector3(0, 1, 0));
        
        // Créer les ennemis
        this.enemyManager = new EnemyManager(this.scene);
        this.enemyManager.spawnEnemies(5);
        
        // Systèmes
        this.combatSystem = new CombatSystem(this.player);
        this.uiManager = new UIManager();
        this.inputManager = new InputManager(this.canvas);
        
        this.lastFrameTime = performance.now();
    }

    public run(): void {
        this.engine.runRenderLoop(() => {
            this.update();
            this.scene.render();
        });

        // Gérer le redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    private update(): void {
            const currentTime = performance.now();
            this.deltaTime = (currentTime - this.lastFrameTime) / 1000;
            this.lastFrameTime = currentTime;
        
            if (this.deltaTime > 0.1) this.deltaTime = 0.1;
        
            // 1. On récupère l'état brut des touches
            const inputs = this.inputManager.getInputs();
            
            // 2. Gestion de l'ouverture de l'inventaire (ne doit pas être bloqué par isGuiOpen)
            // On vérifie si la touche vient d'être pressée pour éviter le clignotement
            if (inputs.inventory) {
                const isOpen = this.uiManager.toggleInventory();
                this.inputManager.isGuiOpen = isOpen;
        
                if (isOpen) {
                    document.exitPointerLock();
                } else {
                    this.canvas.requestPointerLock();
                }
            }
        
            // 3. On récupère les inputs filtrés (mouvement = false si inventaire ouvert)
            const activeInputs = this.inputManager.getInputs();
        
            // 4. LOGIQUE DE COMBAT : Déclenchement des sorts
            // On vérifie les compétences seulement si le menu est fermé
            if (!this.inputManager.isGuiOpen) {
                if (activeInputs.attack) {
                    this.combatSystem.useSkill('slash', this.enemyManager.getEnemies());
                }
                if (activeInputs.skill1) {
                    this.combatSystem.useSkill('fireball', this.enemyManager.getEnemies());
                }
            }
    
            // 5. Mise à jour des entités et systèmes
            this.player.update(this.deltaTime, activeInputs);
            this.updateCamera();
            this.enemyManager.update(this.deltaTime, this.player);
            this.combatSystem.update(this.deltaTime); // Important pour les cooldowns
            
            // 6. Mise à jour visuelle
            this.uiManager.update(this.player, this.enemyManager.getEnemies());
        }

    private updateCamera(): void {
        const playerPos = this.player.getPosition();
        const cameraDistance = 25;
        const cameraHeight = 15;
        
        const targetPos = new BABYLON.Vector3(
            playerPos.x,
            playerPos.y + cameraHeight,
            playerPos.z - cameraDistance
        );
        
        this.camera.position = BABYLON.Vector3.Lerp(
            this.camera.position,
            targetPos,
            0.1
        );
        
        this.camera.setTarget(new BABYLON.Vector3(playerPos.x, playerPos.y + 1, playerPos.z));
    }
}
