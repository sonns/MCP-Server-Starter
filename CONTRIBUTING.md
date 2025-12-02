# Contributing to MCP Server Starter

Thank you for your interest in contributing to this MCP server template!

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MCP-Server-Starter
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build the project**
   ```bash
   pnpm run build
   ```

4. **Make your changes** in the `src/` directory

5. **Test your changes**
   ```bash
   pnpm run check  # Run all checks
   ```

## Code Style

We follow strict TypeScript and code quality standards. Please review [CODING_STANDARDS.md](./CODING_STANDARDS.md) for detailed guidelines.

### Key Points

- **TypeScript**: Use strict mode, no `any` types
- **Formatting**: Run `pnpm run format` before committing
- **Linting**: Fix all ESLint warnings with `pnpm run lint:fix`
- **Documentation**: Add JSDoc comments for all public functions
- **Naming**:
  - Files: `kebab-case.ts`
  - Functions: `camelCase()`
  - Classes/Interfaces: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`

## Testing Your Changes

1. **Build the project**
   ```bash
   pnpm run build
   ```

2. **Run type checks**
   ```bash
   pnpm run typecheck
   ```

3. **Run linter**
   ```bash
   pnpm run lint
   ```

4. **Run all checks**
   ```bash
   pnpm run check
   ```

5. **Test in MCP client** (e.g., Claude Desktop)
   - Configure the server in your MCP client
   - Test all modified functionality
   - Verify no regressions

## Pull Request Process

1. **Fork and create a branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes** following code standards

3. **Update documentation**
   - Update `README.md` if adding/changing features
   - Update `docs/TEST_EXAMPLES.md` with usage examples
   - Add JSDoc comments to all new functions

4. **Commit with conventional commits**
   ```bash
   git commit -m "feat(tools): add new translation tool"
   ```

   Commit types:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `refactor`: Code refactoring
   - `test`: Adding tests
   - `chore`: Maintenance tasks

5. **Push and create PR**
   ```bash
   git push origin feature/my-new-feature
   ```

6. **PR checklist**
   - [ ] Code builds without errors
   - [ ] All checks pass (`pnpm run check`)
   - [ ] Documentation updated
   - [ ] Tests added (if applicable)
   - [ ] Clear PR description

## Adding New Tools

Creating new tools is easy! Follow our guide:

1. **Read the template guide**: [docs/TOOL_TEMPLATE.md](./docs/TOOL_TEMPLATE.md)

2. **Create tool structure**
   ```bash
   mkdir -p src/tools/{service}/{tool-name}
   ```

3. **Implement 4 required files**:
   - `handler.ts` - Business logic
   - `input_schema.ts` - Input validation
   - `output_schema.ts` - Output types
   - `index.ts` - Public exports

4. **Register in** `src/tools/index.ts`

5. **Add tests and examples** in `docs/TEST_EXAMPLES.md`

See [docs/TOOL_TEMPLATE.md](./docs/TOOL_TEMPLATE.md) for detailed step-by-step guide.

## Adding New Features

When adding new features, consider:

- **Tools**: Are they useful examples for template users?
- **Resources**: Do they demonstrate good resource patterns?
- **Prompts**: Are they reusable and well-documented?
- **Utilities**: Are they generic enough to be reused?

### Feature Categories

1. **New Tools** - Follow [docs/TOOL_TEMPLATE.md](./docs/TOOL_TEMPLATE.md)
2. **New Resources** - Add to `src/resources/`
3. **New Prompts** - Add to `src/prompts/`
4. **Utilities** - Add to `src/utils/`
5. **Documentation** - Update `docs/`

## Documentation

Please update documentation for any changed functionality:

- **Code comments**: JSDoc for all public APIs
- **README.md**: For major features or setup changes
- **docs/SETUP_GUIDE.md**: For installation/setup changes
- **docs/TEST_EXAMPLES.md**: For new tools or examples
- **CODING_STANDARDS.md**: For new patterns or conventions

## Project Structure

```
src/
├── tools/              # MCP tools (organized by service)
├── resources/          # MCP resources
├── prompts/            # MCP prompts
└── utils/              # Shared utilities

docs/
├── SETUP_GUIDE.md      # Setup instructions
├── TEST_EXAMPLES.md    # Testing examples
└── TOOL_TEMPLATE.md    # Tool creation guide
```

## Code Review Guidelines

Your PR will be reviewed for:

1. **Code Quality**
   - Follows TypeScript best practices
   - No `any` types
   - Proper error handling
   - Clear variable names

2. **Testing**
   - All checks pass
   - Manually tested in MCP client
   - No regressions

3. **Documentation**
   - JSDoc comments present
   - README updated if needed
   - Examples provided

4. **Style**
   - Consistent formatting
   - Follows naming conventions
   - Clean commit messages

## Common Tasks

### Adding a Weather Tool

```bash
# 1. Create structure
mkdir -p src/tools/weather/my-tool

# 2. Copy template files from existing tool
cp src/tools/weather/forecast/*.ts src/tools/weather/my-tool/

# 3. Modify for your needs

# 4. Register in src/tools/index.ts

# 5. Build and test
pnpm run build
```

### Adding a Garoon Tool

```bash
# Same process, under garoon service
mkdir -p src/tools/garoon/my-tool
```

### Adding Utilities

```bash
# Add to utils/
touch src/utils/my-utility.ts

# Export from utils if needed
# Update src/utils/index.ts (if exists)
```

## Debugging

### Build Issues

```bash
# Clean and rebuild
pnpm run clean
pnpm install
pnpm run build
```

### Type Errors

```bash
# Check types
pnpm run typecheck

# Common fixes:
# - Add .js to imports: import X from "./file.js"
# - Add proper type annotations
# - Avoid using 'any'
```

### Linting Issues

```bash
# Auto-fix most issues
pnpm run lint:fix

# Check what can't be auto-fixed
pnpm run lint
```

## Getting Help

- **Documentation**: Check `docs/` folder
- **Examples**: Look at existing tools in `src/tools/`
- **Coding Standards**: See [CODING_STANDARDS.md](./CODING_STANDARDS.md)
- **Tool Template**: See [docs/TOOL_TEMPLATE.md](./docs/TOOL_TEMPLATE.md)
- **Issues**: Open an issue for discussion

## Questions?

Feel free to open an issue for discussion before making major changes.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
