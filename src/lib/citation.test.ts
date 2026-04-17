import { strict as assert } from "node:assert";
import { test } from "node:test";

import {
  crossrefMessageToCitationRecord,
  formatApa,
  formatBibtex,
  normalizeDoi,
} from "./citation";

test("normalizeDoi strips DOI URLs and lowercases the value", () => {
  assert.equal(normalizeDoi("https://doi.org/10.5555/ABC-123"), "10.5555/abc-123");
});

test("formatBibtex uses the citation fields", () => {
  const output = formatBibtex({
    doi: "10.5555/abc-123",
    title: "Diffusion Models in Practice",
    authors: [
      { given: "Alice", family: "Smith" },
      { given: "Bob", family: "Lee" },
    ],
    journal: "Journal of Examples",
    year: "2024",
    volume: "10",
    issue: "2",
    pages: "12-34",
    url: "https://doi.org/10.5555/abc-123",
  });

  assert.match(output, /^@article\{/);
  assert.match(output, /title = \{Diffusion Models in Practice\}/);
  assert.match(output, /pages = \{12--34\}/);
});

test("formatApa renders a readable citation line", () => {
  const output = formatApa({
    doi: "10.5555/abc-123",
    title: "Diffusion Models in Practice",
    authors: [
      { given: "Alice", family: "Smith" },
      { given: "Bob", family: "Lee" },
    ],
    journal: "Journal of Examples",
    year: "2024",
    volume: "10",
    issue: "2",
    pages: "12-34",
    url: "https://doi.org/10.5555/abc-123",
  });

  assert.equal(
    output,
    "Smith, A., Lee, B. (2024). Diffusion Models in Practice. Journal of Examples, 10(2), 12-34. https://doi.org/10.5555/abc-123",
  );
});

test("crossrefMessageToCitationRecord extracts the key metadata fields", () => {
  const record = crossrefMessageToCitationRecord({
    DOI: "https://doi.org/10.5555/ABC-123",
    title: ["Diffusion Models in Practice"],
    "container-title": ["Journal of Examples"],
    author: [{ given: "Alice", family: "Smith" }],
    volume: "10",
    issue: "2",
    page: "12-34",
    published: { "date-parts": [[2024, 5, 20]] },
    type: "journal-article",
  });

  assert.equal(record.doi, "10.5555/abc-123");
  assert.equal(record.title, "Diffusion Models in Practice");
  assert.equal(record.journal, "Journal of Examples");
  assert.equal(record.year, "2024");
  assert.equal(record.pages, "12-34");
});
