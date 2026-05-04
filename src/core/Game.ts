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
    private light: BABYLON.Light;
    
    private player!: Player;
    private enemyManager!: EnemyManager;
    private combatSystem!: CombatSystem;
    private uiManager!: UIManager;
    private inputManager!: InputManager;
    
    private deltaTime: number = 0;
    private lastFrameTime: number = 0;

    constructor() {
        this.canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        
        // Configuration de la caméra
        this.camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(0, 10, -20), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.camera.speed = 0;
        this.camera.inertia = 0.8;
        this.camera.angularSensibility = 1000;
        
        // Lighting
        this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);
        this.light.intensity = 0.7;
        
        const pointLight = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(10, 20, 10), this.scene);
        pointLight.intensity = 0.5;
        
        // Skybox
        this.createSkybox();
        
        // Initialiser les systèmes de jeu
        this.initializeSystems();
    }

    private createSkybox(): void {
        const skybox = BABYLON.MeshBuilder.CreateBox('skybox', { size: 1000 }, this.scene);
        const skyboxMaterial = new BABYLON.StandardMaterial('skyboxMaterial', this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.3, 0.5);
        skybox.material = skyboxMaterial;
    }

    private initializeSystems(): void {
        // Créer le joueur
        this.player = new Player(this.scene, new BABYLON.Vector3(0, 1, 0));
        
        // Créer les ennemis
        this.enemyManager = new EnemyManager(this.scene);
        this.enemyManager.spawnEnemies(3);
        
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
        // Calculer deltaTime
        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;

        // Limiter deltaTime pour éviter les sauts
        if (this.deltaTime > 0.1) {
            this.deltaTime = 0.1;
        }

        // Mise à jour des entrées
        const inputs = this.inputManager.getInputs();
        
        // Mise à jour du joueur
        this.player.update(this.deltaTime, inputs);
        
        // Mise à jour de la caméra pour suivre le joueur
        this.updateCamera();
        
        // Mise à jour des ennemis
        this.enemyManager.update(this.deltaTime, this.player);
        
        // Mise à jour du système de combat
        this.combatSystem.update(this.deltaTime);
        
        // Mise à jour de l'UI
        this.uiManager.update(this.player, this.enemyManager.getEnemies());
    }

    private updateCamera(): void {
        const playerPos = this.player.getPosition();
        const cameraDistance = 25;
        const cameraHeight = 12;
        
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
        
        this.camera.setTarget(new BABYLON.Vector3(playerPos.x, playerPos.y + 2, playerPos.z));
    }
}
