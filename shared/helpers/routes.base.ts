import { Router } from 'express';

export abstract class RoutesBase<T> {
    constructor(public router: Router, public path?: string) {}
    public abstract handle(controller: T): void;
}
