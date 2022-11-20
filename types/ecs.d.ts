declare namespace _default {
    export { createWorld };
    export { createEntity };
    export { addComponentToEntity };
    export { removeComponentFromEntity };
    export { getEntities };
    export { removeEntity };
    export { addSystem };
    export { preFixedUpdate };
    export { fixedUpdate };
    export { postFixedUpdate };
    export { update };
    export { preUpdate };
    export { postUpdate };
    export { cleanup };
}
export default _default;
export type ListenerType = 'added' | 'removed';
export type Component = any;
export type Entity = any;
export type Filter = any;
export type System = {
    onPreFixedUpdate?: (dt: number) => void;
    onFixedUpdate?: (dt: number) => void;
    onPostFixedUpdate?: (dt: number) => void;
    onPreUpdate?: (dt: number) => void;
    onUpdate?: (dt: number) => void;
    onPostUpdate?: (dt: number) => void;
};
export type SystemFunction = (world: World) => System;
export type Listener = any;
export type ListenerMap = {
    [key: string]: any;
};
export type ListenerChangeMap = {
    added: ListenerMap;
    removed: ListenerMap;
};
export type DeferredRemovalMap = {
    /**
     * indexes into entities array, sorted from highest to lowest
     */
    entities: number[];
    /**
     * [ entity index, component name ] pairs sorted from highest to lowest
     * Stored as a string but seperated with `__@@ECS@@__`
     */
    components: string[];
};
export type WorldStats = {
    entityCount: number;
    /**
     * key is component id, value is instance count
     */
    componentCount: {
        [key: number]: number;
    };
    /**
     * key is filter id, value is number of times this filter was run this frame
     */
    filterInvocationCount: {
        [key: number]: number;
    };
    systems: {
        name: string;
        timeElapsed: number;
        filters: {
            [key: string]: number;
        };
    }[];
    /**
     * the array index of the currently processed system
     * used to determine which systems invoke queries
     */
    currentSystem: number;
    /**
     * time stats were last sent (used to throttle send)
     */
    lastSendTime: number;
};
export type World = {
    entities: Entity[];
    filters: Filter[];
    systems: System[];
    listeners: ListenerChangeMap[];
    removals: DeferredRemovalMap;
    stats: WorldStats[];
};
/**
 * @typedef { 'added' | 'removed' } ListenerType
 */
/**
 * @typedef { Object } Component
 */
/**
 * @typedef { Object } Entity
 */
/**
 * @typedef { Object } Filter
 */
/**
 * @typedef { Object } System
 * @prop {(dt: number) => void} [onPreFixedUpdate]
 * @prop {(dt: number) => void} [onFixedUpdate]
 * @prop {(dt: number) => void} [onPostFixedUpdate]
 * @prop {(dt: number) => void} [onPreUpdate]
 * @prop {(dt: number) => void} [onUpdate]
 * @prop {(dt: number) => void} [onPostUpdate]
 */
/**
 * @typedef {{
 *   (world: World) => System
 * }} SystemFunction
 * @prop {string} [name] Name of the function. Defaults to "anonymousSystem"
 */
/**
 * @typedef { Object } Listener
 */
/**
 * @typedef {{ [ key: string ]: Listener }} ListenerMap
 */
/**
 * @typedef { Object } ListenerChangeMap
 * @prop {ListenerMap} added
 * @prop {ListenerMap} removed
 */
/**
 * @typedef { Object } DeferredRemovalMap
 * @prop {number[]} entities indexes into entities array, sorted from highest to lowest
 * @prop {string[]} components [ entity index, component name ] pairs sorted from highest to lowest
 * Stored as a string but seperated with `__@@ECS@@__`
 */
/**
 * @typedef { Object } WorldStats
 * @prop {number} entityCount
 * @prop {{ [ key: number ]: number }} componentCount key is component id, value is instance count
 * @prop {{ [ key: number ]: number }} filterInvocationCount key is filter id, value is number of times this filter was run this frame
 * @prop {{
 *   name: string;
 *   timeElapsed: number;
 *   filters: {
 *     [ key: string ]: number;
 *   };
 * }[]} systems
 * @prop {number} currentSystem the array index of the currently processed system
 *   used to determine which systems invoke queries
 * @prop {number} lastSendTime time stats were last sent (used to throttle send)
 */
/**
 * @typedef { Object } World
 * @prop {Entity[]} entities
 * @prop {Filter[]} filters
 * @prop {System[]} systems
 * @prop {ListenerChangeMap[]} listeners
 * @prop {DeferredRemovalMap} removals
 * @prop {WorldStats[]} stats
 */
/**
 * Creates a world and sends window post message with id `mreinstein/ecs-source`
 * and method `worldCreated`
 *
 * @param {number} worldId ID of the world to create
 * @returns {World} created world
 */
declare function createWorld(worldId?: number): World;
/**
 * Creates an entity and adds it to the world, incrementing the entity count
 * @param {World} world world where entity will be added
 * @returns {Entity} the created entity
 */
declare function createEntity(world: World): Entity;
/**
 * Adds a component to the entity
 * @param {World} world world where listener will be invoked
 * @param {Entity} entity
 * @param {string} componentName
 * @param {Component} componentData
 * @returns {void} returns early if this is a duplicate componentName
 */
declare function addComponentToEntity(world: World, entity: Entity, componentName: string, componentData?: Component): void;
/**
 * Removes a component from the entity, optionally deferring removal
 * @param {World} world world where listener will be invoked
 * @param {Entity} entity entity to remove component from
 * @param {string} componentName name of the component to remove
 * @param {boolean} [deferredRemoval] Default is true, optionally defer removal
 * @returns {void} returns early if componentName does not exist on entity
 */
declare function removeComponentFromEntity(world: World, entity: Entity, componentName: string, deferredRemoval?: boolean): void;
/**
 * Get entities from the world with all provided components. Optionally,
 * @param {World} world
 * @param {string[]} componentNames A component filter used to match entities.
 * Must match all of the components in the filter.
 * Can add an exclamation mark at the beginning to query by components that are not present. For example:
 * `const entities = ECS.getEntities(world, [ 'transform', '!hero' ])`
 *
 * @param {ListenerType} [listenerType] Optional. Can be "added" or "removed". Provides a list of entities
 * that match were "added" or "removed" since the last system call which matched the filter.
 * @returns {Entity[]} an array of entities that match the given filters
 */
declare function getEntities(world: World, componentNames: string[], listenerType?: ListenerType): Entity[];
/**
 * Remove an entity from the world
 * @param {World} world world to remove entity from and emit listeners
 * @param {Entity} entity entity to remove
 * @param {boolean} [deferredRemoval] Default is true, optionally defer removal
 * @returns {void} returns early if entity does not exist in world
 */
declare function removeEntity(world: World, entity: Entity, deferredRemoval?: boolean): void;
/**
 * Adds a system to the world.
 * @param {World} world
 * @param {System} fn
 */
declare function addSystem(world: World, fn: System): void;
/**
 *
 * @param {World} world
 * @param {number} dt Change in time since last update, in milliseconds
 */
declare function preFixedUpdate(world: World, dt: number): void;
/**
 *
 * @param {World} world
 * @param {number} dt Change in time since last update, in milliseconds
 */
declare function fixedUpdate(world: World, dt: number): void;
/**
 *
 * @param {World} world
 * @param {number} dt Change in time since last update, in milliseconds
 */
declare function postFixedUpdate(world: World, dt: number): void;
/**
 *
 * @param {World} world
 * @param {number} dt Change in time since last update, in milliseconds
 */
declare function update(world: World, dt: number): void;
/**
 *
 * @param {World} world
 * @param {number} dt Change in time since last update, in milliseconds
 */
declare function preUpdate(world: World, dt: number): void;
/**
 *
 * @param {World} world
 * @param {number} dt Change in time since last update, in milliseconds
 */
declare function postUpdate(world: World, dt: number): void;
/**
 * necessary cleanup step at the end of each frame loop
 * @param {World} world
 */
declare function cleanup(world: World): void;
//# sourceMappingURL=ecs.d.ts.map