import * as BABYLON from '@babylonjs/core';
import { Character, CharacterStats } from './Character';
import { Player } from './Player';

export class Enemy extends Character {
    private detectionRange: number = 15;
    private moveSpeed: number = 3;
    private attackRange: number = 1.5;
    private attackCooldown: number = 0;
    private attackDelay: number = 1.5;
    private target: Player | null = null;
    private enemyType: number = 0;

    constructor(scene: BABYLON.Scene, position: BABYLON.Vector3, enemyType: number = 0) {
        super(scene, position, {
            maxHealth: 30,
            mana: 20,
            attack: 8,
            defense: 2,
            level: 1,
            experience: 50,
        });
        this.enemyType = enemyType;
        this.createMesh();
    }

    private createMesh(): void {
        if (this.enemyType === 0) {
            this.createGoblin();
        } else {
            this.createOrc();
        }
    }
    
    private createGoblin(): void {
        // Petits monstres verts
        const body = BABYLON.MeshBuilder.CreateCapsule('goblinBody', {
            height: 1.2,
            radius: 0.25,
        }, this.scene);
        body.position = this.position.clone();
        body.material = this.createGoblinMaterial();
        
        // Tête (plus grosse)
        const head = BABYLON.MeshBuilder.CreateSphere('goblinHead', {
            diameter: 0.5,
            segments: 12
        }, this.scene);
        head.position.y = 0.8;
        head.parent = body;
        head.material = this.createGoblinMaterial();
        
        this.mesh = body;
    }
    
    private createOrc(): void {
        // Grands monstres rouges
        const body = BABYLON.MeshBuilder.CreateCapsule('orcBody', {
            height: 1.8,
            radius: 0.4,
        }, this.scene);
        body.position = this.position.clone();
        body.material = this.createOrcMaterial();
        
        // Tête
        const head = BABYLON.MeshBuilder.CreateSphere('orcHead', {
            diameter: 0.6,
            segments: 12
        }, this.scene);
        head.position.y = 1.1;
        head.parent = body;
        head.material = this.createOrcMaterial();
        
        // Épée (simple representation)
        const sword = BABYLON.MeshBuilder.CreateBox('orcSword', {
            width: 0.1,
            height: 0.8,
            depth: 0.05
        }, this.scene);
        sword.position = new BABYLON.Vector3(0.5, 0.2, 0);
        sword.parent = body;
        const swordMaterial = new BABYLON.StandardMaterial('swordMat', this.scene);
        swordMaterial.emissiveColor = new BABYLON.Color3(0.7, 0.7, 0.7);
        sword.material = swordMaterial;
        
        this.mesh = body;
    }

    private createGoblinMaterial(): BABYLON.StandardMaterial {
        const material = new BABYLON.StandardMaterial('goblinMaterial', this.scene);
        material.emissiveColor = new BABYLON.Color3(0.3, 0.7, 0.3); // Vert
        material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        return material;
    }
    
    private createOrcMaterial(): BABYLON.StandardMaterial {
        const material = new BABYLON.StandardMaterial('orcMaterial', this.scene);
        material.emissiveColor = new BABYLON.Color3(0.8, 0.3, 0.3); // Rouge foncé
        material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        return material;
    }

    public update(deltaTime: number, player: Player): void {
        if (this.isDead()) return;

        const distanceToPlayer = BABYLON.Vector3.Distance(this.position, player.getPosition());

        if (distanceToPlayer < this.detectionRange) {
            this.target = player;
            this.moveTowardsTarget(deltaTime);

            if (distanceToPlayer < this.attackRange) {
                this.attemptAttack(deltaTime, player);
            }
        } else {
            this.target = null;
            this.idle(deltaTime);
        }

        this.attackCooldown -= deltaTime;
    }

    private moveTowardsTarget(deltaTime: number): void {
        if (!this.target || !this.mesh) return;
    
        const targetPos = this.target.getPosition();
        const direction = targetPos.subtract(this.position).normalize();
    
        // --- CALCUL DE LA ROTATION ---
        // On utilise atan2 pour que l'ennemi pivote vers sa cible
        const angle = Math.atan2(direction.x, direction.z);
        this.mesh.rotation.y = angle;
    
        // --- MOUVEMENT ---
        // On réduit la vitesse ici (3 est une bonne base)
        const speed = 3; 
        const movement = direction.scale(speed * deltaTime);
        
        this.position.addInPlace(movement);
        this.mesh.position = this.position.clone();
    }

    private attemptAttack(deltaTime: number, player: Player): void {
        if (this.attackCooldown <= 0) {
            player.takeDamage(this.stats.attack);
            this.attackCooldown = this.attackDelay;
        }
    }

    private idle(deltaTime: number): void {
        // L'ennemi reste en place quand il n'y a pas de cible
    }

    public takeDamage(amount: number): void {
        this.stats.maxHealth -= amount;
        if (this.stats.maxHealth <= 0) {
            this.die();
        }
    }

    private die(): void {
        // On détruit le mesh pour qu'il disparaisse de l'écran
        if (this.mesh) {
            this.mesh.dispose();
        }
        console.log("L'ennemi est vaincu !");
    }
}
