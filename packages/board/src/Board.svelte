<script lang="ts" context="module">
    import type { Geometry, Grid, Idx, schema } from "@sudoku-studio/schema";
    import type { StateManager, StateRef } from "@sudoku-studio/state-manager";

    import { idxMapToKeysArray, GRID_REGION_THICKNESS_HALF, edgeIdx2svgCoord, getDigits, getBorderPath, GRID_THICKNESS_HALF, num2roman, seriesIdx2seriesCoord } from "@sudoku-studio/board-utils";
    import { derived, readable } from "svelte/store";

    import SelectRender from './svelte/SelectRender.svelte';
    import CursorRender from "./svelte/CursorRender.svelte";

    import GridRender from './svelte/GridRender.svelte';
    import GridRegionRender from './svelte/GridRegionRender.svelte';
    import DigitRender from './svelte/DigitRender.svelte';

    import ThermoRender from './svelte/ThermoRender.svelte';
    import BetweenRender from './svelte/BetweenRender.svelte';
    import DoubleArrowRender from './svelte/DoubleArrowRender.svelte';
    import LockoutRender from './svelte/LockoutRender.svelte';
    import ArrowRender from './svelte/ArrowRender.svelte';
    import LineRender from "./svelte/LineRender.svelte";

    import MinRender from './svelte/MinRender.svelte';
    import MaxRender from './svelte/MaxRender.svelte';
    import OddRender from "./svelte/OddRender.svelte";
    import EvenRender from "./svelte/EvenRender.svelte";

    import KillerRender from './svelte/KillerRender.svelte';
    import QuadrupleRender from './svelte/QuadrupleRender.svelte';
    import DiagonalRender from './svelte/DiagonalRender.svelte';
    import CornerRender from './svelte/CornerRender.svelte';
    import CenterRender from './svelte/CenterRender.svelte';
    import ColorsRender from './svelte/ColorsRender.svelte';
    import PositionNumberRender from './svelte/PositionNumberRender.svelte';
    import LittleKillerRender from "./svelte/LittleKillerRender.svelte";
    import NullRender from './svelte/NullRender.svelte';
    import CloneRender from "./svelte/CloneRender.svelte";

    function WarningRender(args: any) {
        Object.assign(args.props, {
            fill: '#f33',
            outlineOpacity: '#eee',
            innerOpacity: '#333',
        });
        return new SelectRender(args);
    }

    function FilledRender(args: any) {
        args.props.color = '#4e72b0';
        args.props.mask = 'url(#SUDOKU_MASK_GIVENS)';
        return new DigitRender(args);
    }

    function DifferenceRender(args: any) {
        Object.assign(args.props, {
            idx2coord: edgeIdx2svgCoord,
            stroke: '#242424',
            fill: '#fff',
            textColor: '#000',
            strokeWidth: 0.02,
        });
        return new PositionNumberRender(args);
    }

    function RatioRender(args: any) {
        Object.assign(args.props, {
            idx2coord: edgeIdx2svgCoord,
            stroke: 'none',
            fill: '#000',
            textColor: '#fff',
        });
        return new PositionNumberRender(args);
    }

    function XVRender(args: any) {
        Object.assign(args.props, {
            idx2coord: edgeIdx2svgCoord,
            stroke: 'none',
            fill: '#fff',
            textColor: '#000',
            radius: 0.17,
            fontSize: 0.3,
            fontWeight: 800,
            mapDigits: (num: true | number) => true !== num ? num2roman(num) : '_',
        });
        return new PositionNumberRender(args);
    }

    function SeriesRender(args: any) {
        Object.assign(args.props, {
            idx2coord: (idx: Idx<Geometry.SERIES>, grid: Grid) => {
                const [ x, y ] = seriesIdx2seriesCoord(idx, grid);
                return [ x + 0.5, y + 0.5 ];
            },
            radius: 0,
            textColor: '#000',
            fontSize: 0.5,
            mapDigits: (num: true | number) => true !== num ? num : '_',
        });
        return new PositionNumberRender(args);
    }

    function PalindromeRender(args: any) {
        Object.assign(args.props, {
            stroke: '#ed8',
            strokeWidth: 0.125,
        });
        return new LineRender(args);
    }

    function GermanWhisperRender(args: any) {
        Object.assign(args.props, {
            stroke: '#8c8',
            strokeWidth: 0.1,
            pathOptions: {
                shortenHead: 0.15,
                shortenTail: 0.15,
                bezierRounding: 0.15,
                closeLoops: true,
            },
        });
        return new LineRender(args);
    }

    function DutchWhisperRender(args: any) {
        Object.assign(args.props, {
            stroke: '#ff8c00',
            strokeWidth: 0.1,
            pathOptions: {
                shortenHead: 0.15,
                shortenTail: 0.15,
                bezierRounding: 0.15,
                closeLoops: true,
            },
        });
        return new LineRender(args);
    }

    function RenbanRender(args: any) {
        Object.assign(args.props, {
            stroke: '#c8c',
            strokeWidth: 0.075,
            pathOptions: {
                shortenHead: 0.15,
                shortenTail: 0.15,
                bezierRounding: 0.15,
                closeLoops: true,
            },
        });
        return new LineRender(args);
    }

    function SlowThermoRender(args: any) {
        Object.assign(args.props, {
            isSlow: true,
        });
        return new ThermoRender(args);
    }

    export type ElementRenderer = NonNullable<typeof ELEMENT_RENDERERS[keyof typeof ELEMENT_RENDERERS]>;
    export const ELEMENT_RENDERERS = {
        ['select']: SelectRender,
        ['cursor']: CursorRender,
        ['warning']: WarningRender,

        ['grid']: GridRender,
        ['gridRegion']: GridRegionRender,

        ['givens']: DigitRender,
        ['filled']: FilledRender,
        ['corner']: CornerRender,
        ['center']: CenterRender,
        ['colors']: ColorsRender,

        ['thermo']: ThermoRender,
        ['slowThermo']: SlowThermoRender,
        ['between']: BetweenRender,
        ['lockout']: LockoutRender,
        ['doubleArrow']: DoubleArrowRender,
        ['palindrome']: PalindromeRender,
        ['whisper']: GermanWhisperRender,
        ['dutchWhisper']: DutchWhisperRender,
        ['renban']: RenbanRender,
        ['arrow']: ArrowRender,

        ['min']: MinRender,
        ['max']: MaxRender,
        ['odd']: OddRender,
        ['even']: EvenRender,

        ['killer']: KillerRender,
        ['clone']: CloneRender,

        ['quadruple']: QuadrupleRender,
        ['difference']: DifferenceRender,
        ['ratio']: RatioRender,
        ['xv']: XVRender,

        ['littleKiller']: LittleKillerRender,
        ['sandwich']: SeriesRender,
        ['xsum']: SeriesRender,
        ['skyscraper']: SeriesRender,

        ['diagonal']: DiagonalRender,

        ['knight']: NullRender,
        ['king']: NullRender,
        ['disjointGroups']: NullRender,
        ['consecutive']: NullRender,
        ['antiX']: NullRender,
        ['antiV']: NullRender,
        ['selfTaxicab']: NullRender,
    } as const;

    // TODO denormalize this.
    const MARGINS = {
        ['grid']: GRID_THICKNESS_HALF,
        ['gridRegion']: GRID_REGION_THICKNESS_HALF,

        ['sandwich']: 1,
        ['xsum']: 1,
        ['skyscraper']: 1,
        ['littleKiller']: 0.9,
    } as { [K in keyof typeof ELEMENT_RENDERERS]?: number };

</script>
<script lang="ts">
    export let userState:  undefined | null | StateManager;
    export let warningState: undefined | null | StateManager;
    export let boardState: StateManager;
    export let svg: SVGSVGElement = null!;


    const grid = boardState.ref('grid');

    const elementsRef = boardState.ref('elements');
    const givensMaskPath = derived([ elementsRef, grid ], ([ elements, grid ]) =>
        getBorderPath(idxMapToKeysArray(getDigits(elements || {}, true, false)), grid, 0) || undefined);
    const givensFilledMaskPath = derived([ elementsRef, grid ], ([ elements, grid ]) =>
        getBorderPath(idxMapToKeysArray(getDigits(elements || {}, true, true)), grid, 0) || undefined);

    type ElementList = {
        id: string,
        type: keyof typeof ELEMENT_RENDERERS,
        order: number,
        ref: StateRef,
        element: ElementRenderer
    }[];

    const list = readable<ElementList>([], set => {
        const list: ElementList = [];
        if (null != userState) {
            list.push(
                {
                    id: 'select_192839012', // TODO
                    type: 'select',
                    order: 95, // TODO
                    ref: userState.ref('select'), // TODO
                    element: SelectRender,
                },
                {
                    id: 'cursor_192839012', // TODO
                    type: 'cursor',
                    order: 94, // TODO
                    ref: userState.ref('cursor'), // TODO
                    element: CursorRender,
                },
            );
        }
        if (null != warningState) {
            list.push({
                id: 'warning_19282093', // TODO
                type: 'warning',
                order: 94,
                ref: warningState.ref('cells'),
                element: WarningRender,
            });
        }

        boardState.ref('elements/*').watch<schema.Element>(([ _elements, elementId ], oldVal, newVal) => {
            const type = oldVal?.type || newVal?.type;

            // Element has been deleted via undo/redo
            if (null == type) return;

            let i = -1;
            if (null != oldVal) {
                i = list.findIndex(({ id }) => elementId === id);
                if (0 > i) {
                    console.error(`Failed to find renderer for constraint with id ${elementId}.`);
                    return;
                }
            }

            // newVal is null when deleting manually
            // newVal.type is null when deleting via undo/redo
            if (null == newVal || null == newVal.type) {
                // Deleted.
                list.splice(i, 1);
            }
            else {
                const element = ELEMENT_RENDERERS[type];
                if (null == element) {
                    console.warn(`Cannot render unknown constraint type: ${type}.`);
                    return;
                }

                const item = {
                    id: elementId,
                    type,
                    order: newVal.order,
                    ref: boardState.ref(_elements, elementId, 'value'),
                    element,
                };

                if (null == oldVal) {
                    list.push(item);
                }
                else {
                    if (oldVal.type !== newVal.type)
                        console.error('Cannot change type of constraint!');
                    list[i] = item;
                }
            }
            list.sort((a, b) => a.order - b.order);
            set(list);
        }, true);
    });

    // TODO somehow update this based on elements.
    const viewBox = derived([ grid, list ], ([ $grid, $list ]) => {
        const margin = $list
            .map(({ type }) => MARGINS[type])
            .filter<number>((margin): margin is number => null != margin)
                .reduce((a, b) => a > b ? a : b, 0);
        return {
            x: -margin,
            y: -margin,
            width: $grid.width + 2 * margin,
            height: $grid.height + 2 * margin,
        };
    });
</script>

<svg bind:this={svg} viewBox="{$viewBox.x} {$viewBox.y} {$viewBox.width} {$viewBox.height}" xmlns="http://www.w3.org/2000/svg">
    <style>
        svg {
            font-family: "Mulish", "Muli", sans-serif;
        }
        text {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        text::selection {
            background: none;
        }
        svg * {
            pointer-events: none;
        }
        .hide {
            display: none;
        }
    </style>
    <defs>
        <mask id="SUDOKU_MASK_GIVENS" maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width={$grid.width} height={$grid.height} fill="#fff" />
            <path d={$givensMaskPath} fill="#000" stroke="none" />
        </mask>
        <mask id="SUDOKU_MASK_GIVENS_FILLED" maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width={$grid.width} height={$grid.height} fill="#fff" />
            <path d={$givensFilledMaskPath} fill="#000" stroke="none" />
        </mask>
        {#each $list as { id, ref, element } (id)}
            <svelte:component this={element} {id} {ref} grid={$grid} />
        {/each}
    </defs>
    {#each $list as { id } (id)}
        <use href="#{id}" />
    {/each}
</svg>
