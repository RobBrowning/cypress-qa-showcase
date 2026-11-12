/** SauceDemo marks its elements with data-test attributes. One helper, one selector style. */
export const byTest = (id: string): string => `[data-test="${id}"]`;
