import * as BABYLON from '@babylonjs/core';

export interface CharacterStats {
    maxHealth: number;
    mana: number;
    attack: number;
    defense: number;
    level: number;
    experience: number;
}

export abstract class Character {
    protected scene: BABYLON.Scene;
    protected position: BABYLON.Vector3;
    protected mesh: BABYLON.Mesh | null = null;
    
    protected stats: CharacterStats & { health: number };

    constructor(scene: BABYLON.Scene, position: BABYLON.Vector3, stats: CharacterStats) {
        this.scene = scene;
        this.position = position.clone();
        this.stats = {
            ...stats,
            health: stats.maxHealth,
        };
    }

    public abstract update(deltaTime: number, ...args: any[]): void;

    public getStats(): CharacterStats & { health: number } {
        return { ...this.stats };
    }

    public getHealth(): number {
        return this.stats.health;
    }

    public getMaxHealth(): number {
        return this.stats.maxHealth;
    }

    public takeDamage(damage: number): void {
        this.stats.health -= damage;
        if (this.stats.health < 0) {
            this.stats.health = 0;
        }
    }

    public heal(amount: number): void {
        this.stats.health += amount;
        if (this.stats.health > this.stats.maxHealth) {
            this.stats.health = this.stats.maxHealth;
        }
    }

    public isDead(): boolean {
        return this.stats.health <= 0;
    }

    public getPosition(): BABYLON.Vector3 {
        return this.position.clone();
    }

    public getMesh(): BABYLON.Mesh | null {
        return this.mesh;
    }

    public destroy(): void {
        if (this.mesh) {
            this.mesh.dispose();
        }
    }
}
