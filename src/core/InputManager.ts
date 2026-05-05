export interface Inputs {
    moveForward: boolean;
    moveBackward: boolean;
    moveLeft: boolean;
    moveRight: boolean;
    jump: boolean; // Ajouté pour correspondre à ton handleKeyDown
    attack: boolean;
    skill1: boolean;
    skill2: boolean;
    inventory: boolean;
    quests: boolean;
    pause: boolean;
}

export class InputManager {
    public isGuiOpen: boolean = false; // Flag pour savoir si un menu est ouvert
    
    private inputs: Inputs = {
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        jump: false,
        attack: false,
        skill1: false,
        skill2: false,
        inventory: false,
        quests: false,
        pause: false,
    };

    constructor(canvas: HTMLCanvasElement) {
        this.setupEventListeners(canvas);
    }

    private setupEventListeners(canvas: HTMLCanvasElement): void {
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
        document.addEventListener('keyup', (event) => this.handleKeyUp(event));
        canvas.addEventListener('click', (event) => this.handleMouseClick(event));
    }

    private handleKeyDown(event: KeyboardEvent): void {
        const code = event.code; 
        
        // Anti-répétition pour les menus
        if (event.repeat && (code === 'KeyI' || code === 'KeyQ' || code === 'Escape')) return;

        switch (code) {
            case 'KeyW':
            case 'ArrowUp':
                this.inputs.moveForward = true;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.inputs.moveBackward = true;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                if (event.shiftKey) this.inputs.quests = true;
                else this.inputs.moveLeft = true;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.inputs.moveRight = true;
                break;
            case 'KeyE':
                this.inputs.skill1 = true;
                break;
            case 'KeyR':
                this.inputs.skill2 = true;
                break;
            case 'KeyI':
                this.inputs.inventory = true;
                break;
            case 'Space':
                this.inputs.jump = true;
                break;
            case 'Escape':
                this.inputs.pause = true;
                break;
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        // IMPORTANT : Utiliser code ici aussi pour être raccord avec KeyDown
        const code = event.code; 

        switch (code) {
            case 'KeyW':
            case 'ArrowUp':
                this.inputs.moveForward = false;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.inputs.moveBackward = false;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.inputs.moveLeft = false;
                this.inputs.quests = false;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.inputs.moveRight = false;
                break;
            case 'KeyE':
                this.inputs.skill1 = false;
                break;
            case 'KeyR':
                this.inputs.skill2 = false;
                break;
            case 'KeyI':
                this.inputs.inventory = false;
                break;
            case 'Space':
                this.inputs.jump = false;
                break;
            case 'Escape':
                this.inputs.pause = false;
                break;
        }
    }

    private handleMouseClick(event: MouseEvent): void {
        if (this.isGuiOpen) return; // Pas d'attaque si on clique dans l'inventaire
        
        this.inputs.attack = true;
        setTimeout(() => {
            this.inputs.attack = false;
        }, 100);
    }

    public getInputs(): Inputs {
        // Si l'UI est ouverte, on neutralise les mouvements et l'attaque
        if (this.isGuiOpen) {
            return {
                ...this.inputs,
                moveForward: false,
                moveBackward: false,
                moveLeft: false,
                moveRight: false,
                jump: false,
                attack: false
            };
        }
        return { ...this.inputs };
    }
}
