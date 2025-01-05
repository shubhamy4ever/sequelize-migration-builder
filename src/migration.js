const fs = require("fs-extra");
const path = require("path");
const ejs = require("ejs");
const prettier = require("prettier");

async function generateMigration(modelsPath, templatePath) {
  const defaultTemplatePath = path.join(
    __dirname,
    "../templates/migration.ejs"
  );
  const template = templatePath
    ? await fs.readFile(templatePath, "utf8")
    : await fs.readFile(defaultTemplatePath, "utf8");

  const files = await fs.readdir(modelsPath);
  const migrationsDir = path.join(process.cwd(), "migrations");
  await fs.ensureDir(migrationsDir);

  for (const file of files) {
    try {
      const modelPath = path.resolve(modelsPath, file);
      const modelImport = require(modelPath);

      const model = extractModelDefinition(modelImport);

      if (!model || !model.name || !model.schema) {
        console.error(
          `Skipping invalid model in file ${file}: missing name or schema.`
        );
        continue;
      }

      // processing the schema and prepare it for rendering
      const processedSchema = Object.entries(model.schema).reduce(
        (acc, [key, value]) => {
          const column = {
            ...value,
            type: `Sequelize.${value.type}`, // converting its type to sequelize format
          };

          if (value.references) {
            column.references = {
              model: value.references.model,
              key: value.references.key,
            };
          }

          acc[key] = column;
          return acc;
        },
        {}
      );

      let migrationContent = ejs.render(template, {
        model: {
          name: model.name,
          schema: processedSchema,
        },
      });

      // formatting the output using prettier
      migrationContent = await prettier.format(migrationContent.trim(), {
        parser: "babel",
      });

      const migrationFile = path.join(
        migrationsDir,
        `${Date.now()}-${model.name}.js`
      );
      await fs.writeFile(migrationFile, migrationContent + "\n");
      console.log(`Created migration file: ${migrationFile}`);
    } catch (error) {
      console.error(`Error processing file ${file}:`, error.message);
      continue; // skipping to the next file
    }
  }
}

function extractModelDefinition(modelImport) {
  if (typeof modelImport === "function") {
    try {
      const Sequelize = require("sequelize");
      const sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
      });

      // intializing the model
      const model = modelImport(sequelize, Sequelize.DataTypes);

      // extracting the rawAttributes for schema
      const schema = Object.fromEntries(
        Object.entries(model.rawAttributes).map(([key, value]) => {
          let references;
          if (value.references) {
            references = {
              model: typeof value.references.model === "string" 
                ? value.references.model 
                : value.references.model.tableName || value.references.model.name, // get table name
              key: value.references.key,
            };
          }

          // if default value is string
          const defaultValue =
          typeof value.defaultValue === "string"
            ? `"${value.defaultValue}"`
            : value.defaultValue;

          return [
            key,
            {
              type: value.type.key, // sequelize data type (e.g: STRING, INTEGER)
              allowNull: value.allowNull,
              defaultValue,
              primaryKey: value.primaryKey,
              unique: value.unique,
              autoIncrement: value.autoIncrement,
              references, // assign references
            },
          ];
        })
      );

      return {
        name: model.tableName || model.name, // table name
        schema,
      };
    } catch (error) {
      console.error(
        `Failed to extract model definition: ${error.message}`
      );
      return null;
    }
  }

  console.error(
    "Invalid model format. Ensure it follows the sequelize.define template."
  );
  return null;
}

module.exports = { generateMigration };

