import { Player } from '../entities/Player';

export interface Skill {
    name: string;
    manaCost: number;
    damage: number;
    cooldown: number;
}

export class CombatSystem {
    private player: Player;
    private skills: Map<string, Skill> = new Map();
    private skillCooldowns: Map<string, number> = new Map();

    constructor(player: Player) {
        this.player = player;
        this.initializeSkills();
    }

    private initializeSkills(): void {
        this.skills.set('fireball', {
            name: 'Boule de Feu',
            manaCost: 20,
            damage: 25,
            cooldown: 3,
        });

        this.skills.set('slash', {
            name: 'Coup d\'épée',
            manaCost: 0,
            damage: 15,
            cooldown: 1,
        });
    }

    public update(deltaTime: number): void {
        // Mise à jour des cooldowns
        for (const [skillName, cooldown] of this.skillCooldowns.entries()) {
            this.skillCooldowns.set(skillName, cooldown - deltaTime);
        }
    }

    public useSkill(skillName: string, targetEnemies?: any[]): boolean { // On peut passer les ennemis ici
        const skill = this.skills.get(skillName);
        if (!skill) return false;
    
        const stats = this.player.getStats();
        const currentCooldown = this.skillCooldowns.get(skillName) || 0;
    
        if (stats.mana < skill.manaCost || currentCooldown > 0) return false;
    
        // --- 1. CONSOMMER LE MANA ---
        // Il faudra ajouter une méthode consumeMana dans ta classe Player
        this.player.consumeMana(skill.manaCost);
    
        // --- 2. APPLIQUER LE COOLDOWN ---
        this.skillCooldowns.set(skillName, skill.cooldown);
    
        // --- 3. LOGIQUE DE DÉGÂTS (Exemple simple) ---
        console.log(`Le joueur lance ${skill.name} !`);
        
        // Si tu as une liste d'ennemis, tu peux vérifier qui est à portée
        if (targetEnemies) {
            targetEnemies.forEach(enemy => {
                const distance = BABYLON.Vector3.Distance(this.player.getPosition(), enemy.getPosition());
                if (distance < 5) { // Portée arbitraire de 5 unités
                    enemy.takeDamage(skill.damage);
                }
            });
        }
    
        return true;
    }
    public getSkill(skillName: string): Skill | undefined {
        return this.skills.get(skillName);
    }

    public getSkillCooldown(skillName: string): number {
        return this.skillCooldowns.get(skillName) || 0;
    }
}
