export type ElemNames<ValidElements> = keyof ValidElements

export type PropNames<
  ValidElements,
  N extends ElemNames<ValidElements>
> = keyof ValidElements[N]

export type PropValue<
  ValidElements,
  N extends ElemNames<ValidElements>,
  Prop extends PropNames<ValidElements, N>
> = ValidElements[N][Prop]

export type EventModifierPropNames<
  ValidElements,
  N extends ElemNames<ValidElements>
> = Exclude<
  {
    [Prop in PropNames<ValidElements, N>]: NonNullable<
      PropValue<ValidElements, N, Prop>
    > extends Function
      ? Prop
      : never
  }[PropNames<ValidElements, N>],
  undefined
>

export type EventModifiers<
  ValidElements,
  N extends ElemNames<ValidElements>,
  name extends string
> = {
  [Prop in EventModifierPropNames<ValidElements, N> as `${string &
    Prop}-${name}`]?: PropValue<ValidElements, N, Prop> | boolean
}

export type EventModifierProps<
  ValidElements,
  N extends ElemNames<ValidElements>
> = {} & EventModifiers<ValidElements, N, "stopPropagation"> &
  EventModifiers<ValidElements, N, "preventDefault"> &
  EventModifiers<ValidElements, N, "preventDefault-stopPropagation">
