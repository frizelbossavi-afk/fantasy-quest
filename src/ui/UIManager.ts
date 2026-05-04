import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';

export class UIManager {
    private uiElement: HTMLElement | null = null;

    constructor() {
        this.uiElement = document.getElementById('ui');
    }

    public update(player: Player, enemies: Enemy[]): void {
        if (!this.uiElement) return;

        const playerStats = player.getStats();
        const healthPercent = (playerStats.health / playerStats.maxHealth) * 100;
        const manaPercent = (playerStats.mana / 100) * 100;

        const html = `
            <div style="position: absolute; top: 20px; left: 20px; color: white; font-family: Arial; z-index: 1000;">
                <div style="background: rgba(0, 0, 0, 0.5); padding: 10px; border-radius: 5px; width: 300px;">
                    <div style="margin-bottom: 10px;">
                        <strong>Niveau ${playerStats.level}</strong> | EXP: ${playerStats.experience}
                    </div>
                    <div style="margin-bottom: 10px;">
                        <div style="font-size: 12px; margin-bottom: 3px;">Santé: ${playerStats.health}/${playerStats.maxHealth}</div>
                        <div style="background: #333; height: 20px; border-radius: 3px; overflow: hidden;">
                            <div style="background: #00ff00; height: 100%; width: ${healthPercent}%; transition: width 0.3s;"></div>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 12px; margin-bottom: 3px;">Mana: ${playerStats.mana}/100</div>
                        <div style="background: #333; height: 20px; border-radius: 3px; overflow: hidden;">
                            <div style="background: #0099ff; height: 100%; width: ${manaPercent}%; transition: width 0.3s;"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="position: absolute; top: 20px; right: 20px; color: white; font-family: Arial; z-index: 1000;">
                <div style="background: rgba(0, 0, 0, 0.5); padding: 10px; border-radius: 5px; width: 200px;">
                    <div><strong>Ennemis restants: ${enemies.length}</strong></div>
                </div>
            </div>
            <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); color: white; font-family: Arial; z-index: 1000;">
                <div style="background: rgba(0, 0, 0, 0.5); padding: 10px; border-radius: 5px;">
                    <strong>Contrôles:</strong> ZQSD - Déplacement | Clic - Attaque | E/R - Compétences | I - Inventaire | Shift+Q - Quêtes
                </div>
            </div>
        `;
        
        this.uiElement.innerHTML = html;
    }
}
