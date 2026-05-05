import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';

export class UIManager {
    private uiElement: HTMLElement | null = null;
    private isInventoryOpen: boolean = false; // On garde l'état ici

    constructor() {
        this.uiElement = document.getElementById('ui');
    }

    // Cette méthode permettra de basculer l'affichage
    public toggleInventory(): boolean {
        this.isInventoryOpen = !this.isInventoryOpen;
        return this.isInventoryOpen;
    }

    public update(player: Player, enemies: Enemy[]): void {
        if (!this.uiElement) return;

        const playerStats = player.getStats();
        const healthPercent = (playerStats.health / playerStats.maxHealth) * 100;
        const manaPercent = (playerStats.mana / 100) * 100;

        // --- GÉNÉRATION DE L'INVENTAIRE ---
        // On crée le HTML de l'inventaire seulement s'il est ouvert
        const inventoryHTML = this.isInventoryOpen ? `
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        width: 400px; height: 500px; background: rgba(20, 20, 20, 0.9); 
                        border: 3px solid #444; color: white; padding: 20px; border-radius: 10px; z-index: 2000;">
                <h2 style="text-align: center; border-bottom: 1px solid #555; padding-bottom: 10px;">INVENTAIRE</h2>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 20px;">
                    ${Array(16).fill('<div style="width: 70px; height: 70px; background: #333; border: 1px solid #555; border-radius: 5px;"></div>').join('')}
                </div>
                <div style="margin-top: 20px; text-align: center; color: #aaa;">Appuyez sur 'I' pour fermer</div>
            </div>
        ` : '';

        // --- TON HTML EXISTANT + L'INVENTAIRE ---
        const hudHTML = `
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
                    <strong>Contrôles:</strong> ZQSD - Déplacement | Clic - Attaque | E/R - Compétences | I - Inventaire
                </div>
            </div>

            ${inventoryHTML}
        `;
        
        this.uiElement.innerHTML = hudHTML;
    }
}
