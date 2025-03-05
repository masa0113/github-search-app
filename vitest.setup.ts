import { expect } from "vitest";
import * as matchers from "vitest-axe/matchers";

import "vitest-axe/extend-expect";
import "vitest-canvas-mock";
import "@testing-library/jest-dom/vitest";

expect.extend(matchers);
