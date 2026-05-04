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

    public useSkill(skillName: string): boolean {
        const skill = this.skills.get(skillName);
        if (!skill) return false;

        const playerStats = this.player.getStats();
        const cooldown = this.skillCooldowns.get(skillName) || 0;

        if (playerStats.health <= 0) return false;
        if (playerStats.mana < skill.manaCost) return false;
        if (cooldown > 0) return false;

        console.log(`Utilisation de ${skill.name}!`);
        this.skillCooldowns.set(skillName, skill.cooldown);
        return true;
    }

    public getSkill(skillName: string): Skill | undefined {
        return this.skills.get(skillName);
    }

    public getSkillCooldown(skillName: string): number {
        return this.skillCooldowns.get(skillName) || 0;
    }
}
