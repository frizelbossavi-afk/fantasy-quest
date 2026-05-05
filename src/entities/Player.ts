import * as BABYLON from '@babylonjs/core';
import { Inputs } from '../core/InputManager';
import { Character } from './Character';

export class Player extends Character {
    private meshes: BABYLON.Mesh[] = [];
    private velocity: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    private moveSpeed: number = 8;
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
        const torso = BABYLON.MeshBuilder.CreateCapsule('playerTorso', {
            height: 1.2,
            radius: 0.3,
        }, this.scene);
        torso.position = this.position.clone();
        torso.material = this.createTorsoMaterial();
        this.meshes.push(torso);

        const head = BABYLON.MeshBuilder.CreateSphere('playerHead', {
            segments: 16,
            diameter: 0.4,
        }, this.scene);
        head.position.y = 1.1;
        head.parent = torso;
        head.material = this.createHeadMaterial();
        this.meshes.push(head);
        
        const leftArm = BABYLON.MeshBuilder.CreateCapsule('leftArm', {
            height: 1,
            radius: 0.15,
        }, this.scene);
        leftArm.position = new BABYLON.Vector3(-0.45, 0.3, 0);
        leftArm.parent = torso;
        leftArm.material = this.createLimbMaterial();
        this.meshes.push(leftArm);
        
        const rightArm = BABYLON.MeshBuilder.CreateCapsule('rightArm', {
            height: 1,
            radius: 0.15,
        }, this.scene);
        rightArm.position = new BABYLON.Vector3(0.45, 0.3, 0);
        rightArm.parent = torso;
        rightArm.material = this.createLimbMaterial();
        this.meshes.push(rightArm);
        
        const leftLeg = BABYLON.MeshBuilder.CreateCapsule('leftLeg', {
            height: 0.9,
            radius: 0.15,
        }, this.scene);
        leftLeg.position = new BABYLON.Vector3(-0.25, -0.8, 0);
        leftLeg.parent = torso;
        leftLeg.material = this.createLegMaterial();
        this.meshes.push(leftLeg);
        
        const rightLeg = BABYLON.MeshBuilder.CreateCapsule('rightLeg', {
            height: 0.9,
            radius: 0.15,
        }, this.scene);
        rightLeg.position = new BABYLON.Vector3(0.25, -0.8, 0);
        rightLeg.parent = torso;
        rightLeg.material = this.createLegMaterial();
        this.meshes.push(rightLeg);

        this.mesh = torso;
    }

    private createTorsoMaterial(): BABYLON.StandardMaterial {
        const material = new BABYLON.StandardMaterial('playerTorso', this.scene);
        material.emissiveColor = new BABYLON.Color3(0.1, 0.3, 0.8);
        material.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        return material;
    }

    private createHeadMaterial(): BABYLON.StandardMaterial {
        const material = new BABYLON.StandardMaterial('playerHead', this.scene);
        material.emissiveColor = new BABYLON.Color3(0.9, 0.8, 0.6);
        material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        return material;
    }
    
    private createLimbMaterial(): BABYLON.StandardMaterial {
        const material = new BABYLON.StandardMaterial('playerLimb', this.scene);
        material.emissiveColor = new BABYLON.Color3(0.9, 0.8, 0.6);
        material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        return material;
    }
    
    private createLegMaterial(): BABYLON.StandardMaterial {
        const material = new BABYLON.StandardMaterial('playerLeg', this.scene);
        material.emissiveColor = new BABYLON.Color3(0.2, 0.15, 0.1);
        material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        return material;
    }

    public update(deltaTime: number, inputs: Inputs): void {
        this.handleMovement(deltaTime, inputs);
        this.applyGravity(deltaTime);
        this.updatePosition(deltaTime);
        
        // --- REGEN DE MANA (Optionnel mais recommandé) ---
        if (this.stats.mana < 100) {
            this.stats.mana = Math.min(100, this.stats.mana + (2 * deltaTime)); // 2 mana par seconde
        }
    }

    private handleMovement(deltaTime: number, inputs: Inputs): void {
        const moveDirection = BABYLON.Vector3.Zero();
    
        if (inputs.moveForward) moveDirection.z += 1;
        if (inputs.moveBackward) moveDirection.z -= 1;
        if (inputs.moveLeft) moveDirection.x -= 1;
        if (inputs.moveRight) moveDirection.x += 1;
    
        if (moveDirection.length() > 0) {
            moveDirection.normalize();
            
            // Correction de l'erreur "Possibly Null" sur this.mesh
            if (this.mesh) {
                const targetAngle = Math.atan2(moveDirection.x, moveDirection.z);
                this.mesh.rotation.y = targetAngle;
            }
    
            moveDirection.scaleInPlace(this.moveSpeed * deltaTime);
            this.velocity.x = moveDirection.x;
            this.velocity.z = moveDirection.z;
        } else {
            this.velocity.x *= 0.9; 
            this.velocity.z *= 0.9;
        }
    
        if (inputs.jump && !this.isJumping) {
            this.velocity.y = this.jumpForce;
            this.isJumping = true;
        }
    
        if (inputs.attack) {
            this.attack();
        }
    }

    private applyGravity(deltaTime: number): void {
        const groundLevel = 0.6;
        if (this.position.y > groundLevel) {
            this.velocity.y -= this.gravity * deltaTime;
        } else {
            this.velocity.y = 0;
            this.position.y = groundLevel;
            this.isJumping = false;
        }
    }

    private updatePosition(deltaTime: number): void {
        this.position.addInPlace(this.velocity.scale(deltaTime));
        // Correction de l'erreur "Possibly Null"
        if (this.mesh) {
            this.mesh.position = this.position.clone();
        }
    }

    private attack(): void {
        console.log('Attaque du joueur!');
    }

    public getPosition(): BABYLON.Vector3 {
        return this.position.clone();
    }

    public takeDamage(damage: number): void {
        this.stats.health -= damage;
        console.log(`Joueur prend ${damage} dégâts. Santé: ${this.stats.health}`);
    }

    public consumeMana(amount: number): void {
        this.stats.mana = Math.max(0, this.stats.mana - amount);
    }
}
