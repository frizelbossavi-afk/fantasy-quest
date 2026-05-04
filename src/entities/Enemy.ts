import * as BABYLON from '@babylonjs/core';
import { Character, CharacterStats } from './Character';
import { Player } from './Player';

export class Enemy extends Character {
    private detectionRange: number = 20;
    private moveSpeed: number = 10;
    private attackRange: number = 2;
    private attackCooldown: number = 0;
    private attackDelay: number = 1.5;
    private target: Player | null = null;

    constructor(scene: BABYLON.Scene, position: BABYLON.Vector3) {
        super(scene, position, {
            maxHealth: 30,
            mana: 20,
            attack: 8,
            defense: 2,
            level: 1,
            experience: 50,
        });
        this.createMesh();
    }

    private createMesh(): void {
        const body = BABYLON.MeshBuilder.CreateBox('enemyBody', { size: 1 }, this.scene);
        body.position = this.position.clone();
        body.material = this.createEnemyMaterial();
        this.mesh = body;
    }

    private createEnemyMaterial(): BABYLON.StandardMaterial {
        const material = new BABYLON.StandardMaterial('enemyMaterial', this.scene);
        material.diffuse = new BABYLON.Color3(1, 0.2, 0.2);
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
        if (!this.target) return;

        const targetPos = this.target.getPosition();
        const direction = targetPos.subtract(this.position).normalize();
        const movement = direction.scale(this.moveSpeed * deltaTime);
        
        this.position.addInPlace(movement);
        
        if (this.mesh) {
            this.mesh.position = this.position.clone();
        }
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
}
