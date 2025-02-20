export type ElementWithXAttributes<T extends Element = HTMLElement> = withXAttributes<T>;

export type withXAttributes<T extends Element> = T & Partial<XAttributes>;

export interface XAttributes {
    _x_virtualDirectives: Bindings;
    _x_ids: Record<string, number>;
    _x_effects: Set<() => void>;
    _x_runEffects: () => void;
    _x_dataStack: Array<Record<string, unknown>>;
    _x_ignore: true;
    _x_ignoreSelf: true;
    _x_isShown: boolean;
    _x_bindings: Record<string, unknown>;
    _x_undoAddedClasses: () => void;
    _x_undoAddedStyles: () => void;
    _x_cleanups: MutationCallback[];
    _x_attributeCleanups: Record<string, Array<() => void>>;
    _x_ignoreMutationObserver: boolean;
    _x_teleportBack: ElementWithXAttributes;
    _x_refs_proxy: Record<string, unknown>;
    _x_refs: unknown;
    _x_keyExpression: string;
    _x_prevKeys: string[];
    _x_forScope: Record<string, unknown>;
    _x_lookup: Record<string, ElementWithXAttributes>;
    _x_currentIfEl: ElementWithXAttributes;
    _x_undoIf: () => void;
    _x_removeModelListeners: Record<string, () => void>;
    _x_model: {
        get: () => unknown;
        set: (value: unknown) => void;
    };
    _x_forceModelUpdate: (value: unknown) => void;
    _x_forwardEvents: string[];
    _x_doHide: () => void;
    _x_doShow: () => void;
    _x_toggleAndCascadeWithTransitions: (
        el: ElementWithXAttributes,
        val: boolean,
        show: () => void,
        hide: () => void,
    ) => void;
    _x_teleport: ElementWithXAttributes;
    _x_transition: Transitions;
    _x_hidePromise: Promise<() => void>;
    _x_transitioning: {
        beforeCancel: (fn: () => void) => void;
        beforeCancels: Array<() => void>;
        cancel: () => void;
        finish: () => void;
    };
    _x_hideChildren: ElementWithXAttributes[];
    _x_inlineBindings: Record<string, Binding>;
}

export type Transitions = {
    enter: TransitionStages;
    leave: TransitionStages;
} & TransitionFromObject;
export type TransitionStages = Partial<{
    start: string | TransitionFromHelpers;
    during: string | TransitionFromHelpers;
    end: string | TransitionFromHelpers;
}>;
type TransitionFromHelpers = Partial<CSSStyleDeclaration>;
interface TransitionFromObject {
    in: (before: () => void, after?: () => void) => void;
    out: (before: () => void, after?: () => void) => void;
}

interface Binding {
    expression: string;
    extract: boolean;
}

export interface Bindings {
    [key: string]: string | (() => unknown);
}

export type AttrMutationCallback = (
    el: ElementWithXAttributes,
    attrs: Array<{
        name: string;
        value: string;
    }>,
) => void;

export interface DirectiveData {
    type: string;
    value: string;
    modifiers: string[];
    expression: string;
    original: string;
}

type InterceptorCallback<T> = (initial: T, get: () => T, set: (val: T) => void, path: string, key: string) => T;

export interface InterceptorObject<T> {
    initialValue: T;
    _x_interceptor: true;
    initialize: (data: Record<string, unknown>, path: string, key: string) => T;
}

type InferInterceptor<T> = T extends InterceptorObject<infer U> ? U
    : keyof T extends never ? T
    : {
        [K in keyof T]: InferInterceptor<T[K]>;
    };

export type InferInterceptors<T> = {
    [K in keyof T]: InferInterceptor<T[K]>;
};

type interceptor = <T>(
    callback: InterceptorCallback<T>,
    mutateObj?: (obj: InterceptorObject<T>) => void,
) => (initialValue: T) => InterceptorObject<T>;

export interface DirectiveUtilities {
    Alpine: Alpine;
    effect: <T>(callback: () => T) => ReactiveEffect<T>;
    cleanup: (callback: () => void) => void;
    // eslint-disable-next-line @definitelytyped/no-unnecessary-generics
    evaluateLater: <T>(expression: string) => (callback?: (value: T) => void, extras?: {}) => void;
    evaluate: <T>(expression: string | (() => T), extras?: Record<string, unknown>, _?: boolean) => T;
}
export type MagicUtilities = DirectiveUtilities & {
    interceptor: interceptor;
};

export interface DirectiveCallback {
    (el: ElementWithXAttributes, directive: DirectiveData, utilities: DirectiveUtilities): void;
    inline?: (el: ElementWithXAttributes, directive: DirectiveData, utilities: DirectiveUtilities) => void;
}

export type WalkerCallback = (el: ElementWithXAttributes, skip: () => void) => void;

export type AlpineComponent<T> = T & XDataContext & ThisType<InferInterceptors<T> & XDataContext & Magics<T>>;

interface XDataContext {
    /**
     * Will be executed before Alpine initializes the rest of the component.
     */
    init?(): void;
    /**
     * Will be executed when the component is destroyed.
     */
    destroy?(): void;
}

export interface Stores {
    [key: string | symbol]: unknown;
}

export interface Magics<T> {
    /**
     * Access to current Alpine data.
     */
    $data: InferInterceptors<T>;
    /**
     * Dispatches a CustomEvent on the current DOM node.
     * Event automatically bubbles up.
     *
     * @param event the event name
     * @param detail an event-dependent value associated with the event, the value is then available to the handler using the CustomEvent.detail property
     */
    $dispatch: (event: string, detail?: any) => void;
    /**
     * Retrieve the current DOM node.
     */
    $el: HTMLElement;
    /**
     * Generate an element's ID and ensure that it won't conflict with other IDs of the same name on the same page.
     *
     * @param name the name of the id
     * @param key suffix on the end of the generated ID, usually helpful for the purpose of identifying id in a loop
     */
    $id: (name: string, key?: number | string | null) => string;
    /**
     * Execute a given expression AFTER Alpine has made its reactive DOM updates.
     *
     * @param callback a callback that will be fired after Alpine finishes updating the DOM
     */
    $nextTick: (callback?: () => void) => Promise<void>;
    /**
     * Retrieve DOM elements marked with x-ref inside the component.
     */
    $refs: Record<string, HTMLElement>;
    /**
     * Accesses the root element of the current component context.
     */
    $root: ElementWithXAttributes;
    /**
     * Access registered global Alpine stores.
     */
    $store: Stores;
    /**
     * Fire the given callback when the value in the property is changed.
     *
     * @param property the component property
     * @param callback a callback that will fire when a given property is changed
     */
    $watch: <K extends keyof T | string, V extends K extends keyof T ? T[K] : any>(
        property: K,
        callback: (newValue: V, oldValue: V) => void,
    ) => void;
}

export type PluginCallback = (Alpine: Alpine) => void;

export interface ReactiveEffect<T = any> {
    (): T;
    id: number;
    active: boolean;
    raw: () => T;
}

export interface Alpine {
    /**
     * Wraps an object in a reactive proxy
     *
     * @param obj an object to be wrapped
     * @returns a reactive proxy
     */
    readonly reactive: <T>(obj: T) => T;
    /**
     * Stops an effect from re-evaluating on dependency change
     *
     * @param effect reactive operation
     */
    readonly release: (effect: ReactiveEffect) => void;
    /**
     * Creates a reactive effect
     *
     * @param fn callback to be executed when dependencies change
     * @returns effect
     */
    readonly effect: <T>(fn: () => T) => ReactiveEffect<T>;
    /**
     * Returns the raw value of a reactive proxy
     *
     * @param obj reactive proxy
     * @returns raw object
     */
    readonly raw: <T>(obj: T) => T;
    version: string;
    flushAndStopDeferringMutations: () => void;
    dontAutoEvaluateFunctions: (callback: () => void) => void;
    disableEffectScheduling: (callback: () => void) => void;
    startObservingMutations: () => void;
    stopObservingMutations: () => void;
    setReactivityEngine: <E>(engine: {
        reactive: <T>(obj: T) => T;
        release: (effect: E) => void;
        effect: (fn: () => any) => E;
        raw: <T>(obj: T) => T;
    }) => void;
    onAttributeRemoved: (el: ElementWithXAttributes, name: string, callback: () => void) => void;
    onAttributesAdded: (callback: AttrMutationCallback) => void;
    closestDataStack: (node: ElementWithXAttributes) => Array<Record<string | symbol, unknown>>;
    skipDuringClone: <T extends (...args: Parameters<T>) => ReturnType<T>>(callback: T, fallback?: T) => T;
    onlyDuringClone: (callback: DirectiveCallback) => DirectiveCallback;
    addRootSelector: (selectorCallback: () => string) => void;
    addInitSelector: (selectorCallback: () => string) => void;
    addScopeToNode: (
        node: Element,
        data: Record<string, unknown>,
        referenceNode?: ElementWithXAttributes,
    ) => () => void;
    deferMutations: () => void;
    mapAttributes: (
        callback: (attribute: { name: string; value: string | (() => unknown) }) => {
            name: string;
            value: string | (() => unknown);
        },
    ) => void;
    /**
     * Provides a function that can be called to evaluate an expression
     * in the context of the specified element
     */
    evaluateLater: <T_1>(
        el: Element,
        expression?: string | (() => T_1),
    ) => (
        callback?: (value: T_1) => void,
        extras?: {
            scope?: object;
            params?: unknown[];
        },
    ) => void;
    interceptInit: (callback: WalkerCallback) => void;
    setEvaluator: (
        newEvaluator: <T_2>(
            el: ElementWithXAttributes,
            expression?: string | (() => T_2),
        ) => (
            callback: (value: T_2) => void,
            extras?: {
                scope?: object;
                params?: unknown[];
            },
        ) => void,
    ) => void;
    /**
     * "Flattens" an array of objects into a single Proxy object
     * @param {Array} objects
     * @returns flattened object
     */
    mergeProxies: (objects: Array<Record<string, unknown>>) => Record<string, unknown>;
    extractProp: <T_3 extends string | boolean>(
        el: ElementWithXAttributes,
        name: string,
        fallback: T_3 | (() => T_3),
        extract?: boolean,
    ) => unknown;
    /**
     * Finds closest Node that satisfies the provided test function
     * @param {Node} el
     * @param callback
     * @returns {Node}
     */
    findClosest: (el: Element, callback: (el: ElementWithXAttributes) => boolean) => Element;
    closestRoot: (el: ElementWithXAttributes, includeInitSelectors?: boolean) => ElementWithXAttributes | undefined;
    destroyTree: (root: ElementWithXAttributes) => void;
    interceptor: interceptor;
    transition: (
        el: ElementWithXAttributes,
        setFunction:
            | ((
                el: ElementWithXAttributes,
                value:
                    | string
                    | boolean
                    | Record<string, boolean>
                    | (() => string | boolean | Record<string, boolean>),
            ) => () => void)
            | ((el: ElementWithXAttributes, value: string | Partial<CSSStyleDeclaration>) => () => void),
        {
            during,
            start,
            end,
        }: Partial<{
            start: string | Partial<CSSStyleDeclaration>;
            during: string | Partial<CSSStyleDeclaration>;
            end: string | Partial<CSSStyleDeclaration>;
        }>,
        before?: () => void,
        after?: () => void,
    ) => void;
    setStyles: (el: ElementWithXAttributes, value: string | Partial<CSSStyleDeclaration>) => () => void;
    /**
     * Runs an operation without having Alpine react to changes in the DOM caused by the function
     * Useful for making a set of changes to the DOM and manually handling initialization
     * @param {function} callback
     */
    mutateDom: <T_5>(callback: () => T_5) => T_5;
    /**
     * Registers a new directive that can be used in markup (ex. `x-directive`)
     * @param {string} name
     * @param {function} callback
     */
    directive: (
        name: string,
        callback: DirectiveCallback,
    ) => {
        before(directive: string): void;
    };
    /**
     * Entangles two objects
     * Creates a reactive effect that bidirectionally bings the getters and setters on each object
     *
     * @param outer
     * @param inner
     */
    entangle: <T_6>(
        {
            get: outerGet,
            set: outerSet,
        }: {
            get: () => T_6;
            set: (value: T_6) => void;
        },
        {
            get: innerGet,
            set: innerSet,
        }: {
            get: () => T_6;
            set: (value: T_6) => void;
        },
    ) => () => void;
    /**
     * Provides a throttled version of the passed in function
     * Can be called multiple times and only executes once per specified time
     *
     * @param {function} func
     * @param {number} wait time to throttle
     * @returns {function} throttled function
     */
    throttle: <T_7 extends (...args: Parameters<T_7>) => void>(
        func: T_7,
        limit?: number,
    ) => (...args: Parameters<T_7>) => void;
    /**
     * Provides a debounced version of the passed in function
     * Can be called multiple times and only executes after specified delay
     * since last call
     *
     * @param {function} func
     * @param {number} wait time to debounce
     * @returns {function} debounced function
     */
    debounce: <T_8 extends (...args: Parameters<T_8>) => void>(func: T_8, wait?: number) => T_8;
    /**
     * Evaluates a string expression within the Alpine context of a particular Node
     *
     * @param {Node} el element in Alpine Context
     * @param {string} expression function or string expression
     * @param {object} extras additional values to expose to the expression
     * @returns whatever the expression returns
     */
    evaluate: <T_9>(el: Node, expression: string | (() => T_9), extras?: {}) => T_9;
    initTree: (
        el: ElementWithXAttributes,
        walker?: (el: ElementWithXAttributes, callback: WalkerCallback) => any,
        intercept?: WalkerCallback,
    ) => void;
    /**
     * Waits until after a frame is painted to continue execution
     * @param callback
     * @returns Promise that resolves on the next frame
     */
    nextTick: (callback?: () => void) => Promise<unknown>;
    prefixed: (subject?: string) => string;
    prefix: (newPrefix: string) => void;
    /**
     * Registers Plugins onto Alpine
     */
    plugin: (callbacks: PluginCallback | PluginCallback[]) => void;
    /**
     * Registers a magic accessible at $name in Alpine contexts
     * @param name name of Magic
     * @param callback Method that builds the magic's value
     */
    magic: (name: string, callback: (el: ElementWithXAttributes, options: MagicUtilities) => unknown) => void;
    /**
     * Registers a global reactive store to a name
     * or accesses a global reactive store by name
     */
    store: {
        <T extends keyof Stores>(name: T): Stores[T];
        <T extends keyof Stores>(name: T, value: Stores[T]): void;
    };
    /**
     * Starts Alpine on the current document
     */
    start: () => void;
    clone: (oldEl: ElementWithXAttributes, newEl: ElementWithXAttributes) => void;
    bound: (el: ElementWithXAttributes, name: string, fallback?: unknown) => unknown;
    /**
     * Gets the data context of a particular Node
     * This is a "flattened" object of all the components that element is within
     * @param node Element inside an Alpine Component
     * @returns Object
     */
    $data: (node: ElementWithXAttributes) => {};
    walk: (el: ElementWithXAttributes, callback: WalkerCallback) => any;
    /**
     * Registers a component constructor a name referenceable inside `x-data` expressions
     *
     * @param name Component name
     * @param callback Data context constructor function
     */
    // eslint-disable-next-line @definitelytyped/no-unnecessary-generics
    data: <T extends { [key in keyof T]: T[key] }, A extends unknown[]>(
        name: string,
        callback: (...args: A) => AlpineComponent<T>, // Needed generic to properly autotype objects
    ) => void;
    bind: (name: string | ElementWithXAttributes, bindings: Bindings | ((...args: unknown[]) => Bindings)) => void;
}

declare const Alpine: Alpine;
export default Alpine;
