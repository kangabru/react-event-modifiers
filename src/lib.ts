import { ReactElement, createElement } from "react"
import { EventModifierProps } from "./types"

type ValidElements = JSX.IntrinsicElements
type ValidNames = keyof ValidElements

export const reactEventModifier = new Proxy({} as HTMLComponents, {
  get: (_target, key: string) => eventModifierWrapper(key as any),
})

const debug = false

type HTMLComponents = {
  [K in ValidNames]: HTMLComponent<K>
}

export type HTMLComponentProps<N extends ValidNames> = ValidElements[N] &
  EventModifierProps<ValidElements, N>

type HTMLComponent<N extends ValidNames> = (
  props: HTMLComponentProps<N>
) => ReactElement

const eventModifierWrapper = function <N extends ValidNames>(
  el: N
): HTMLComponent<N> {
  return function EventModifier(props: ValidElements[N]) {
    return createElement(el, modifyEvents(props))
  }
}

export function modifyEvents<
  N extends ValidNames,
  IProps extends HTMLComponentProps<N>,
  OProps extends ValidElements[N]
>(props: IProps): OProps {
  const _props: Record<string, any> = {}
  for (const [propKey, propVal] of Object.entries(props)) {
    const [key, val] = addEventHandlerToProp(propKey, propVal)
    _props[key] = val
  }
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
function addEventHandlerToProp<TVal>(
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
