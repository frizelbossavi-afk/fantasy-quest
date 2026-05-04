export interface Inputs {
    moveForward: boolean;
    moveBackward: boolean;
    moveLeft: boolean;
    moveRight: boolean;
    attack: boolean;
    skill1: boolean;
    skill2: boolean;
    inventory: boolean;
    quests: boolean;
    pause: boolean;
}

export class InputManager {
    private inputs: Inputs = {
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
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
        const key = event.key.toLowerCase();
        
        switch (key) {
            case 'z':
            case 'arrowup':
                this.inputs.moveForward = true;
                break;
            case 's':
            case 'arrowdown':
                this.inputs.moveBackward = true;
                break;
            case 'q':
                if (event.shiftKey) {
                    this.inputs.quests = true;
                } else {
                    this.inputs.moveLeft = true;
                }
                break;
            case 'd':
            case 'arrowright':
                this.inputs.moveRight = true;
                break;
            case 'e':
                this.inputs.skill1 = true;
                break;
            case 'r':
                this.inputs.skill2 = true;
                break;
            case 'i':
                this.inputs.inventory = true;
                break;
            case 'escape':
                this.inputs.pause = true;
                break;
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        const key = event.key.toLowerCase();
        
        switch (key) {
            case 'z':
            case 'arrowup':
                this.inputs.moveForward = false;
                break;
            case 's':
            case 'arrowdown':
                this.inputs.moveBackward = false;
                break;
            case 'q':
                this.inputs.moveLeft = false;
                this.inputs.quests = false;
                break;
            case 'd':
            case 'arrowright':
                this.inputs.moveRight = false;
                break;
            case 'e':
                this.inputs.skill1 = false;
                break;
            case 'r':
                this.inputs.skill2 = false;
                break;
            case 'i':
                this.inputs.inventory = false;
                break;
            case 'escape':
                this.inputs.pause = false;
                break;
        }
    }

    private handleMouseClick(event: MouseEvent): void {
        this.inputs.attack = true;
        setTimeout(() => {
            this.inputs.attack = false;
        }, 100);
    }

    public getInputs(): Inputs {
        return { ...this.inputs };
    }
}
