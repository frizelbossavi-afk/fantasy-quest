import * as BABYLON from '@babylonjs/core';
import { Enemy } from './Enemy';
import { Player } from './Player';

export class EnemyManager {
    private scene: BABYLON.Scene;
    private enemies: Enemy[] = [];

    constructor(scene: BABYLON.Scene) {
        this.scene = scene;
    }

    public spawnEnemies(count: number): void {
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 40;
            const z = (Math.random() - 0.5) * 40;
            const position = new BABYLON.Vector3(x, 0.5, z);
            
            const enemy = new Enemy(this.scene, position);
            this.enemies.push(enemy);
        }
    }

    public update(deltaTime: number, player: Player): void {
        this.enemies = this.enemies.filter(enemy => !enemy.isDead());
        
        for (const enemy of this.enemies) {
            enemy.update(deltaTime, player);
        }
    }

    public getEnemies(): Enemy[] {
        return [...this.enemies];
    }
}
