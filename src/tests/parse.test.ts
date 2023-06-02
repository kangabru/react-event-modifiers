import { HTMLComponentProps, modifyEvents, reactEventModifier } from "../lib"

test("Test proxy", () => {
  const elDiv = reactEventModifier.div
  expect(elDiv).toBeInstanceOf(Object)
  expect(elDiv).toHaveProperty("$$typeof")
  expect(elDiv).toHaveProperty("render")
  expect((elDiv as any).render).toBeInstanceOf(Function)
  expect((elDiv as any).render.name).toBe("EventModifier")

  const elForm = reactEventModifier.form
  expect(elForm).toBeInstanceOf(Object)
  expect(elForm).toHaveProperty("$$typeof")
  expect(elForm).toHaveProperty("render")
  expect((elForm as any).render).toBeInstanceOf(Function)
  expect((elForm as any).render.name).toBe("EventModifier")
})

test("Test modify props", () => {
  const props = {
    className: "hello",
    onClick: () => console.log("on click"),
  }

  const modifiedProps = modifyEvents(props)

  expect(modifiedProps.className).toBe("hello")
  expect(modifiedProps.onClick).toBeInstanceOf(Function)
})

test("Test modify props stopPropagation", () => {
  const [event, data] = createMockEvent()

  const props = {
    className: "hello",
    "onClick-stopPropagation": () => data.push("default"),
  } satisfies HTMLComponentProps<"div">

  const modifiedProps = modifyEvents(props)

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
  } satisfies HTMLComponentProps<"form">

  const modifiedProps = modifyEvents(props)

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
  } satisfies HTMLComponentProps<"form">

  const modifiedProps = modifyEvents(props)

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
  } satisfies HTMLComponentProps<"div">

  const modifiedProps = modifyEvents(props)

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
  } satisfies HTMLComponentProps<"form">

  const modifiedProps = modifyEvents(props)

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
