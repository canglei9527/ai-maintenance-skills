# Navigation And Budgets

## Contents

- Tier-specific navigation records
- Default review thresholds and strict gates
- Split decision order
- Canonical ownership and allowed alternate implementations
- Exceptions and project boundaries

## Navigation Has A Cost Gate

Create a root task map when a `STANDARD` project has multiple source files or maintenance entry points, and always for `DURABLE`. The map records stable workflows that already exist, for example configuration changes, core business rules, input parsing, external adapters, tests, and startup failures.

Create a directory index only when it reduces real navigation cost: multiple independent responsibilities, multiple public entrances, frequently changed files, unclear filenames, or a root route that cannot select the first file. A directory's file count or line count is a prompt for review, not an automatic index gate. `MICRO` does not require either form.

An index should be short and factual:

```text
File | Responsibility | Public interface | Direct dependency | Read when
```

A task route should point to an actual first file, optional one-hop project-owned dependency, smallest focused test, and relevant current architecture/Bug note. Do not store precise source line counts in long-lived indexes; calculate them during verification.

## Default Thresholds

Use these as review thresholds for ordinary work, not as automatic failure or mandatory splitting:

- hand-written implementation source over 400 lines: review responsibility boundaries;
- entry point, facade, compatibility module, or index over 200 lines: review composition and ownership boundaries;
- a typical maintenance path over about 800 implementation lines: review navigation or boundaries.

A threshold review asks whether the file has multiple independent change reasons, whether a clear interface exists, and whether a smaller read set would result. It may conclude that no split is appropriate.

Strict budgets are acceptance gates only for `DURABLE` creation, `STRUCTURAL_CHANGE`, an explicit AI-context optimization request, or an explicit file-size governance request. A strict gate still permits a named, evidence-backed exception. A normal Bug fix in a large existing file remains a normal change: fix the Bug, add the focused regression test, and report the file-size risk without unrelated restructuring.

## Split Decision Order

A weak or time-limited agent must answer these questions in order:

1. Does the file contain multiple independent reasons to change?
2. Can those responsibilities have clear, stable interfaces?
3. Can they be tested or verified independently?
4. Will the split reduce the implementation that must be read for a normal task?
5. Would it add a facade chain, circular dependency, duplicated types, or repeated business rules?
6. Is there a framework, ABI, real-time, linker, or memory-layout constraint?

Split only when the first four support it and the last two do not provide contrary evidence. Function length, branching, nesting, complexity, fan-in/fan-out, public-interface count, and test boundaries are supporting signals only. Do not make a fixed nesting depth, complexity score, same-name function, same-name constant, path, extension, or annotation an automatic failure or exemption.

## Canonical Rules And Implementations

Every business decision has one normative source. Multiple implementations are allowed for CPU/CLA, SIMD/scalar, real/simulated, hardware adapters, or reference/optimized paths only when:

- a common interface is explicit;
- selection logic and configuration defaults have one source;
- each implementation has a distinct ownership reason;
- consistency tests, reference comparisons, or an equivalent verification method exist.

Do not copy a rule into multiple modules, leave an old implementation active behind a new import, stack facades, or maintain the same default/validation/schema/URL decision in several places.

## Project Boundaries

Recursion is limited to the confirmed project root. Exclude `.git`, dependencies, vendor, build output, caches, generated files, binaries, media, secrets, and credentials at every depth. Stop at a nested directory with its own package/build marker unless the user explicitly includes it. A directory name such as `models`, `generated`, or `main` is not evidence of a pure-data or composition-only exception.

## Optional Records

`FUNCTION_INDEX.md` is not a default deliverable. Consider it only when symbol search is unreliable, dynamic registration hides public entrances, the project has many public entrances, or the user asks for it; prefer `rg`, language-server symbols, compiler information, or generated symbol tables.

Do not create an empty Bug directory. Record a Bug only for a confirmed high-impact, recurring, security, data-consistency, cross-module, or project-required defect. Update task routes only when a stable task type, first entry, responsibility, public interface, or directory changes, or when an existing route becomes false.

## Review Evidence

For strict structural work, record the relevant file path, metric, sole responsibility, reason not to split, what splitting would break, public interface, verification method, and a condition for re-review for each named exception. The exception is evidence, not a way to hide unrelated business logic.
