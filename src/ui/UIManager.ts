import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { CombatSystem } from '../systems/CombatSystem'; // On importe le système de combat

export class UIManager {
    private uiElement: HTMLElement | null = null;
    private isInventoryOpen: boolean = false;

    constructor() {
        this.uiElement = document.getElementById('ui');
    }

    public toggleInventory(): boolean {
        this.isInventoryOpen = !this.isInventoryOpen;
        return this.isInventoryOpen;
    }

    // On ajoute "combatSystem: CombatSystem" dans les arguments ici
    public update(player: Player, enemies: Enemy[], combatSystem: CombatSystem): void {
        if (!this.uiElement) return;

        const playerStats = player.getStats();
        const healthPercent = (playerStats.health / playerStats.maxHealth) * 100;
        const manaPercent = (playerStats.mana / 100) * 100;

        // --- GESTION DES COOLDOWNS ---
        const fireballCD = combatSystem.getSkillCooldown('fireball');
        const slashCD = combatSystem.getSkillCooldown('slash');

        // Petit helper pour changer la couleur si le sort est en recharge
        const getSkillStyle = (cd: number) => cd > 0 
            ? 'background: rgba(255, 0, 0, 0.5); border: 2px solid red;' 
            : 'background: rgba(0, 0, 0, 0.6); border: 2px solid #00ff00;';

        // --- HTML DE L'INVENTAIRE ---
        const inventoryHTML = this.isInventoryOpen ? `
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        width: 400px; height: 500px; background: rgba(20, 20, 20, 0.9); 
                        border: 3px solid #444; color: white; padding: 20px; border-radius: 10px; z-index: 2000;">
                <h2 style="text-align: center; border-bottom: 1px solid #555; padding-bottom: 10px;">INVENTAIRE</h2>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 20px;">
                    ${Array(16).fill('<div style="width: 70px; height: 70px; background: #333; border: 1px solid #555; border-radius: 5px;"></div>').join('')}
                </div>
            </div>
        ` : '';

        // --- HTML DU HUD (BARRES + SORTS) ---
        const hudHTML = `
            <div style="position: absolute; top: 20px; left: 20px; color: white; font-family: Arial; z-index: 1000;">
                <div style="background: rgba(0, 0, 0, 0.5); padding: 10px; border-radius: 5px; width: 300px;">
                    <strong>Niveau ${playerStats.level}</strong>
                    <div style="margin: 5px 0;">Santé: ${playerStats.health}</div>
                    <div style="background: #333; height: 15px; border-radius: 3px;"><div style="background: #00ff00; width: ${healthPercent}%; height: 100%;"></div></div>
                    <div style="margin: 5px 0;">Mana: ${playerStats.mana}</div>
                    <div style="background: #333; height: 15px; border-radius: 3px;"><div style="background: #0099ff; width: ${manaPercent}%; height: 100%;"></div></div>
                </div>
            </div>

            <div style="position: absolute; top: 20px; right: 20px; color: white; font-family: Arial;">
                <div style="background: rgba(0, 0, 0, 0.5); padding: 10px; border-radius: 5px;">
                    <strong>Ennemis: ${enemies.length}</strong>
                </div>
            </div>

            <div style="position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%); display: flex; gap: 15px;">
                <div style="${getSkillStyle(slashCD)} width: 60px; height: 60px; border-radius: 8px; color: white; text-align: center; font-family: Arial;">
                    <div style="font-size: 10px; margin-top: 5px;">CLIC</div>
                    <div style="font-weight: bold;">Slash</div>
                    <div style="font-size: 12px;">${slashCD > 0 ? slashCD.toFixed(1) + 's' : 'OK'}</div>
                </div>
                <div style="${getSkillStyle(fireballCD)} width: 60px; height: 60px; border-radius: 8px; color: white; text-align: center; font-family: Arial;">
                    <div style="font-size: 10px; margin-top: 5px;">[E]</div>
                    <div style="font-weight: bold;">Feu</div>
                    <div style="font-size: 12px;">${fireballCD > 0 ? fireballCD.toFixed(1) + 's' : 'OK'}</div>
                </div>
            </div>
            
            <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); color: white; font-family: Arial;">
                <div style="background: rgba(0, 0, 0, 0.5); padding: 10px; border-radius: 5px;">
                    ZQSD - Déplacement | I - Inventaire
                </div>
            </div>

            ${inventoryHTML}
        `;
        
        this.uiElement.innerHTML = hudHTML;
    }
}
