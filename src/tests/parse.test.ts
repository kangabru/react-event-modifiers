import {
  EventModifierElementProps,
  modifyPropEvents,
  reactEventModifier,
} from "../lib"

test("Test proxy", () => {
  const elDiv = reactEventModifier.div
  expect(elDiv).toBeInstanceOf(Object)
  expect(elDiv).toHaveProperty("$$typeof")
  expect(elDiv).toHaveProperty("render")
  expect(elDiv).toHaveProperty("displayName")
  expect((elDiv as any).displayName).toBe("<div> (Event Modified Element)")

  const elForm = reactEventModifier.form
  expect(elForm).toBeInstanceOf(Object)
  expect(elForm).toHaveProperty("$$typeof")
  expect(elForm).toHaveProperty("render")
  expect((elForm as any).displayName).toBe("<form> (Event Modified Element)")
})

test("Test modify props", () => {
  const [event, data] = createMockEvent()

  const props = {
    className: "hello",
    "data-hello-world": true,
    onClick: () => data.push("default"),
  }

  const modifiedProps = modifyPropEvents(props)

  expect(modifiedProps.className).toBe("hello")
  expect(modifiedProps.onClick).toBeInstanceOf(Function)
  expect((modifiedProps as any)["data-hello-world"]).toBe(true)

  expect(data).toStrictEqual([])
  modifiedProps.onClick?.(event as any)
  expect(data).toStrictEqual(["default"] satisfies DataValues[])
})

test("Test modify props stopPropagation", () => {
  const [event, data] = createMockEvent()

  const props = {
    className: "hello",
    "onClick-stopPropagation": () => data.push("default"),
  } satisfies EventModifierElementProps<"div">

  const modifiedProps = modifyPropEvents(props)

  expect(modifiedProps.className).toBe("hello")
  expect(modifiedProps.onClick).toBeInstanceOf(Function)
  expect((modifiedProps as any)["onClick-stopPropagation"]).toBeUndefined()

  expect(data).toStrictEqual([])
  modifiedProps.onClick?.(event as any)
  expect(data).toStrictEqual([
    "stopPropagation",
    "default",
  ] satisfies DataValues[])
})

test("Test modify props preventDefault", () => {
  const [event, data] = createMockEvent()

  const props = {
    className: "hello",
    "onSubmit-preventDefault": () => data.push("default"),
  } satisfies EventModifierElementProps<"form">

  const modifiedProps = modifyPropEvents(props)

  expect(modifiedProps.className).toBe("hello")
  expect(modifiedProps.onSubmit).toBeInstanceOf(Function)
  expect((modifiedProps as any)["onSubmit-preventDefault"]).toBeUndefined()

  expect(data).toStrictEqual([])
  modifiedProps.onSubmit?.(event as any)
  expect(data).toStrictEqual([
    "preventDefault",
    "default",
  ] satisfies DataValues[])
})

test("Test modify props stop+prevent", () => {
  const [event, data] = createMockEvent()

  const props = {
    className: "hello",
    "onSubmit-preventDefault-stopPropagation": () => data.push("default"),
  } satisfies EventModifierElementProps<"form">

  const modifiedProps = modifyPropEvents(props)

  expect(modifiedProps.className).toBe("hello")
  expect(modifiedProps.onSubmit).toBeInstanceOf(Function)
  expect(
    (modifiedProps as any)["onSubmit-preventDefault-stopPropagation"]
  ).toBeUndefined()

  expect(data).toStrictEqual([])
  modifiedProps.onSubmit?.(event as any)
  expect(data).toStrictEqual([
    "stopPropagation",
    "preventDefault",
    "default",
  ] satisfies DataValues[])
})

test("Test modify props boolean stopPropagation", () => {
  const [event, data] = createMockEvent()

  const props = {
    className: "hello",
    "onClick-stopPropagation": true,
  } satisfies EventModifierElementProps<"div">

  const modifiedProps = modifyPropEvents(props)

  expect(modifiedProps.className).toBe("hello")
  expect(modifiedProps.onClick).toBeInstanceOf(Function)
  expect((modifiedProps as any)["onClick-stopPropagation"]).toBeUndefined()

  expect(data).toStrictEqual([])
  modifiedProps.onClick?.(event as any)
  expect(data).toStrictEqual(["stopPropagation"] satisfies DataValues[])
})

test("Test modify props boolean preventDefault", () => {
  const [event, data] = createMockEvent()

  const props = {
    className: "hello",
    "onSubmit-preventDefault": true,
  } satisfies EventModifierElementProps<"form">

  const modifiedProps = modifyPropEvents(props)

  expect(modifiedProps.className).toBe("hello")
  expect(modifiedProps.onSubmit).toBeInstanceOf(Function)
  expect((modifiedProps as any)["onSubmit-preventDefault"]).toBeUndefined()

  expect(data).toStrictEqual([])
  modifiedProps.onSubmit?.(event as any)
  expect(data).toStrictEqual(["preventDefault"] satisfies DataValues[])
})

//#region Utils

type MockEvent = {
  default: () => void
  preventDefault: () => void
  stopPropagation: () => void
}

type DataValues = "default" | "preventDefault" | "stopPropagation"

function createMockEvent(): [MockEvent, DataValues[]] {
  const data: DataValues[] = []
  const event: MockEvent = {
    default: () => data.push("default"),
    preventDefault: () => data.push("preventDefault"),
    stopPropagation: () => data.push("stopPropagation"),
  }
  return [event, data]
}

//#endregion
