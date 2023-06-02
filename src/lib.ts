import { ReactElement, Ref, createElement, forwardRef } from "react"
import { EventModifierProps } from "./types"

type ValidElements = JSX.IntrinsicElements
type ValidNames = keyof ValidElements

export const reactEventModifier = new Proxy({} as EventModifedElements, {
  get: (_target, key: string) => eventModifierWrapper(key as any),
})

const debug = false

type EventModifedElements = {
  [K in ValidNames]: EventModifedElement<K>
}

export type EventModifierElementProps<N extends ValidNames> = ValidElements[N] &
  EventModifierProps<ValidElements, N>

type EventModifedElement<N extends ValidNames> = (
  props: EventModifierElementProps<N>
) => ReactElement

const eventModifierWrapper = function <N extends ValidNames>(
  el: N
): EventModifedElement<N> {
  const WrappedElement = forwardRef(
    (props: ValidElements[N], ref: Ref<unknown>) =>
      createElement(el, modifyPropEvents(props, ref))
  )
  WrappedElement.displayName = `<${el}> (Event Modified Element)`
  return WrappedElement as any
}

export function modifyPropEvents<
  N extends ValidNames,
  IProps extends EventModifierElementProps<N>,
  OProps extends ValidElements[N]
>(props: IProps, ref?: Ref<unknown>): OProps {
  const _props: Record<string, any> = {}
  for (const [propKey, propVal] of Object.entries(props)) {
    const [key, val] = getModifiedPropEvent(propKey, propVal)
    _props[key] = val
  }
  if (ref) _props.ref = ref
  return _props as any
}

/**
 * Wraps functions named with modifiers (like "onClick-stopPropagation") into the appropriate functions.
 * "onClick"
 * @param propName - "className", "onClick", "onClick-stopPropagation-preventDefault"
 * @param propValue - the value like "hello" or `() => console.log("Hello")`
 * @example
 *  A function named "onClick-stopPropagation" becomes "onClick" and the function is wrapped
 */
function getModifiedPropEvent<TVal>(
  propName: string,
  propValue: TVal
): [string, TVal] {
  const nameModifiers = propName.split("-") // ['onClick', 'stopPropagation', 'preventDefault']
  const canModifyFunc = nameModifiers.length > 1
  if (!canModifyFunc) return [propName, propValue]

  const finalNameParts = [] // name parts after strippping modifiers
  let wrappedFunc = propValue as Function | boolean

  for (const namePart of nameModifiers) {
    switch (namePart) {
      case "preventDefault":
        wrappedFunc = wrapFunc(wrappedFunc, (args) => {
          debug && console.log("Event handler: preventDefault()")
          args[0]?.preventDefault?.()
        })
        break

      case "stopPropagation":
        wrappedFunc = wrapFunc(wrappedFunc, (args) => {
          debug && console.log("Event handler: stopPropagation()")
          args[0]?.stopPropagation?.()
        })
        break

      default:
        finalNameParts.push(namePart)
        break
    }
  }

  const finalName = finalNameParts.join("-")
  debug && console.log(`Updated prop ${propName} to ${finalName}`)
  return [finalName, wrappedFunc as TVal]
}

function wrapFunc(
  callback: Function | boolean,
  handler: (args: any[]) => void
): Function {
  return (...args: any[]) => {
    if (callback === true) {
      handler(args)
    } else if (callback instanceof Function) {
      handler(args)
      callback(...args)
    }
  }
}
