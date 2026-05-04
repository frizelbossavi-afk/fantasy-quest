import * as BABYLON from '@babylonjs/core';
import { Inputs } from '../core/InputManager';
import { Character } from './Character';

export class Player extends Character {
    private meshes: BABYLON.Mesh[] = [];
    private velocity: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    private moveSpeed: number = 15;
    private jumpForce: number = 10;
    private isJumping: boolean = false;
    private gravity: number = 9.81;

    constructor(scene: BABYLON.Scene, position: BABYLON.Vector3) {
        super(scene, position, {
            maxHealth: 100,
            mana: 50,
            attack: 15,
            defense: 5,
            level: 1,
            experience: 0,
        });
        this.createMesh();
    }

    private createMesh(): void {
        // Créer le corps du joueur
        const body = BABYLON.MeshBuilder.CreateCapsule('playerBody', {
            height: 2,
            radius: 0.4,
        }, this.scene);
        body.position = this.position.clone();
        body.material = this.createPlayerMaterial();
        this.meshes.push(body);

        // Créer la tête
        const head = BABYLON.MeshBuilder.CreateSphere('playerHead', {
            segments: 16,
            diameter: 0.5,
        }, this.scene);
        head.position.y = 1;
        head.parent = body;
        head.material = this.createHeadMaterial();
        this.meshes.push(head);

        this.mesh = body;
    }

    private createPlayerMaterial(): BABYLON.StandardMaterial {
        const material = new BABYLON.StandardMaterial('playerMaterial', this.scene);
        material.diffuse = new BABYLON.Color3(0.2, 0.6, 1);
        material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        return material;
    }

    private createHeadMaterial(): BABYLON.StandardMaterial {
        const material = new BABYLON.StandardMaterial('headMaterial', this.scene);
        material.diffuse = new BABYLON.Color3(1, 0.8, 0.6);
        material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        return material;
    }

    public update(deltaTime: number, inputs: Inputs): void {
        this.handleMovement(deltaTime, inputs);
        this.applyGravity(deltaTime);
        this.updatePosition(deltaTime);
    }

    private handleMovement(deltaTime: number, inputs: Inputs): void {
        const moveDirection = BABYLON.Vector3.Zero();

        if (inputs.moveForward) moveDirection.z += 1;
        if (inputs.moveBackward) moveDirection.z -= 1;
        if (inputs.moveLeft) moveDirection.x -= 1;
        if (inputs.moveRight) moveDirection.x += 1;

        if (moveDirection.length() > 0) {
            moveDirection.normalize();
            moveDirection.scaleInPlace(this.moveSpeed * deltaTime);
            this.velocity.x = moveDirection.x;
            this.velocity.z = moveDirection.z;
        } else {
            this.velocity.x *= 0.9; // Friction
            this.velocity.z *= 0.9;
        }

        if (inputs.attack) {
            this.attack();
        }
    }

    private applyGravity(deltaTime: number): void {
        // Vérifier les collisions avec le sol (simplifié)
        if (this.position.y > 0.1) {
            this.velocity.y -= this.gravity * deltaTime;
        } else {
            this.velocity.y = 0;
            this.position.y = 0;
            this.isJumping = false;
        }
    }

    private updatePosition(deltaTime: number): void {
        this.position.addInPlace(this.velocity.scale(deltaTime));
        if (this.mesh) {
            this.mesh.position = this.position.clone();
        }
    }

    private attack(): void {
        console.log('Attaque du joueur!');
        // Implémentation du système d'attaque
    }

    public getPosition(): BABYLON.Vector3 {
        return this.position.clone();
    }

    public takeDamage(damage: number): void {
        this.stats.health -= damage;
        console.log(`Joueur prend ${damage} dégâts. Santé: ${this.stats.health}`);
    }
}
