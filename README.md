### **Sequelize Migration Generator**

---

#### **Overview**
This package simplifies the generation of Sequelize migration files from models. It processes models written in either `sequelize.define` format or class-based format, as outlined in Sequelize's official documentation. The generated migrations are compatible with Sequelize CLI commands.

---

#### **Features**
- **Input**: Reads Sequelize models in both `sequelize.define` and class-based formats.
- **Output**: Generates CLI-compatible migration files.
- **Support**: Automatically extracts schema, including references (with limitations).

---

#### **Installation**
1. Install the package using npm:
   ```bash
   npm install sequelize-migration-builder
   ```

2. Ensure you have Sequelize installed in your project:
   ```bash
   npm install sequelize
   ```

---

#### **Supported Model Formats**
This tool supports the following formats for Sequelize models:

1. **Using `sequelize.define`**:
   ```javascript
   module.exports = (sequelize, DataTypes) => {
     const User = sequelize.define("User", {
       id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
       },
       name: {
         type: DataTypes.STRING,
         allowNull: false,
       },
       role_id: {
         type: DataTypes.INTEGER,
         references: {
           model: "Roles", // Must be a string, not an imported reference
           key: "id",
         },
       },
     });
     return User;
   };
   ```

2. **Using Class-Based Format**:
   ```javascript
   const { Model, DataTypes } = require("sequelize");

   module.exports = (sequelize) => {
     class User extends Model {}

     User.init(
       {
         id: {
           type: DataTypes.INTEGER,
           autoIncrement: true,
           primaryKey: true,
         },
         name: {
           type: DataTypes.STRING,
           allowNull: false,
         },
         role_id: {
           type: DataTypes.INTEGER,
           references: {
             model: "Roles", // Use string instead of imported reference
             key: "id",
           },
         },
       },
       {
         sequelize,
         modelName: "User",
       }
     );

     return User;
   };
   ```

For more information about defining models, refer to the official Sequelize documentation:  
[https://sequelize.org/docs/v6/core-concepts/model-basics/](https://sequelize.org/docs/v6/core-concepts/model-basics/)

---

#### **Usage**
There are two ways to use this package: **as a CLI tool** and **as a module in your code**.

---

### **1. CLI Usage**
1. **Prepare Models**:
   - Models must follow `sequelize.define` or class-based format.
   - Ensure that foreign key references use string-based models.

2. **Run the Generator**:
   ```bash
   npx migrator-plugin create-migration --models ./models --template ./migration-template.ejs
   ```
   - `--models`: Path to the folder containing Sequelize models.
   - `--template`: *(Optional)* Path to a custom migration template. If not provided, the default template will be used.

3. **Generated Migrations**:
   - Migrations will be created in a `migrations` directory in your project's root.

---

### **2. Programmatic Usage**
1. **Import the Package**:
   ```javascript
   const { exec } = require('child_process');
   const path = require('path');
   ```

2. **Generate Migrations**:
   ```javascript
   const modelsPath = path.resolve(__dirname, "models/mysql");

   exec(`npx migrator-plugin create-migration --models ${modelsPath}`, (err, stdout, stderr) => {
     if (err) {
       console.error("Error executing CLI:", err);
       return;
     }

     // Output the stdout and stderr (if any)
     if (stdout) {
       console.log("stdout:", stdout);
     }
     if (stderr) {
       console.error("stderr:", stderr);
     }
   });
   ```

---

#### **Default Template Example**
The default migration template (`migration.ejs`) is as follows. If no custom template is provided, this one will be used.

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('<%= model.name %>', {
      <% Object.entries(model.schema).forEach(([key, value], index, array) => { %>
        <%- key %>: {
          <% Object.entries(value).forEach((propKey, propValue, i, propsArray) => { %>
            <% if (propValue !== undefined) { %>
              <% if (propKey === 'references') { %>
                references: {
                  model: '<%- propValue.model %>',
                  key: '<%- propValue.key %>',
                }
              <% } else { %>
                <%- propKey %>: <%- typeof propValue === 'string' ? propValue : JSON.stringify(propValue) %>
              <% } %>
            <% } %>
          <% }); %>
        }<%- index < array.length - 1 ? ',' : '' %>
      <% }); %>
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('<%= model.name %>');
  },
};
```

This template will be used if no custom template is specified. It generates Sequelize migrations for creating tables with columns, including foreign key references.

---

#### **Known Limitations**
1. **Imported References**:
   - **Do not use imported references** for foreign keys (e.g., `model: SomeImportedModel`).
   - Use string values for the `model` property in `references` instead:
     ```javascript
     references: {
       model: "Roles",
       key: "id",
     }
     ```

2. **Default Values**:
   - While the tool attempts to preserve default values, some complex objects may not render correctly.

3. **Ignore Certain Files**:
   - The tool ignores errors caused by files like `index.js` that are often used for setting up the database in the models directory (where the database is initialized). These files are not processed as part of the migration generation and any errors for such files, please ignore those in the CLI.

4. **Incomplete Features**:
   - The package is under development and may have limitations or bugs. Contributions are welcome!

---

#### **Contributing**
1. Fork the repository.
2. Create a new branch for your changes.
3. Submit a pull request describing the updates.

For more detailed instructions on contributing, check out the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

---

#### **License**
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

#### **Thank You!**
We hope this tool simplifies your workflow. If you encounter any issues or have suggestions, feel free to open an issue or contribute to the repository. 🎉

---

