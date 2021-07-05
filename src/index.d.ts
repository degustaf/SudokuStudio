declare namespace schema {
    export interface Board {
        grid: Grid,
        constraints: Record<string, Constraint>,
    }

    export interface Grid {
        width: number,
        height: number,
    }

    export type ConstraintTypeIds = {
        // TODO (UNUSED).
        100: 'diagonal',
        120: 'knight',
        125: 'king',
        200: 'disjointGroups',
        300: 'consecutive',
    };
    export type ConstraintType = ConstraintTypeIds[keyof ConstraintTypeIds];

    export type Constraint = BooleanConstraint | DigonalConstraint;

    interface AbstractConstraint {
        type: ConstraintType,
        value: unknown,
    }

    export interface BooleanConstraint extends AbstractConstraint {
        type: 'knight' | 'king' | 'disjointGroups' | 'consecutive',
        value: {
            positive: boolean,
            negative: boolean,
        },
    }
    export interface DigonalConstraint extends AbstractConstraint {
        type: 'diagonal',
        value: {
            positive: boolean,
            negative: boolean,
        },
    }
}
