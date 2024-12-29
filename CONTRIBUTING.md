# Contributing to Sequelize Migration Generator

We welcome contributions to the **Sequelize Migration Generator** project! Whether it's a bug fix, a feature addition, or an improvement to the documentation, your help is appreciated.

Before contributing, please review the following guidelines.

---

## How to Contribute

### 1. **Fork the Repository**
   - Click on the "Fork" button in the top-right corner of the repository page to create a copy of the repository under your own GitHub account.

### 2. **Clone the Fork**
   - Clone your forked repository to your local machine:
     ```bash
     git clone https://github.com/your-username/sequelize-migration-builder.git
     cd sequelize-migration-builder
     ```

### 3. **Create a New Branch**
   - Create a new branch for the changes you're planning to make:
     ```bash
     git checkout -b feature/your-feature-name
     ```
   - It's important to use a descriptive name for your branch so that others can easily understand the nature of the changes.

### 4. **Make Your Changes**
   - Make the necessary changes to the code, documentation, or tests.
   - Follow the existing code style and conventions. Make sure to run the tests to confirm everything is working as expected.

### 5. **Commit Your Changes**
   - Commit your changes with a clear and concise message:
     ```bash
     git commit -m "Add feature X or fix bug Y"
     ```

### 6. **Push to Your Fork**
   - Push the changes to your forked repository:
     ```bash
     git push origin feature/your-feature-name
     ```

### 7. **Create a Pull Request**
   - Open a pull request (PR) from your fork's branch to the original repository. Provide a detailed description of the changes and any context that might be helpful for the reviewers.

---

## Code of Conduct

Please note that this project adheres to a **Code of Conduct** that promotes a positive and welcoming environment for everyone. We expect all contributors to follow these guidelines.

### **Our Code of Conduct**:
- Be respectful and welcoming to all.
- Engage in constructive discussions.
- Avoid discriminatory or harmful language.
- Focus on making improvements and helping others.

---

## Reporting Issues

If you encounter any bugs or have feature requests, please open an issue in the repository. Be sure to include as much detail as possible, including:

- Steps to reproduce the issue.
- Expected and actual results.
- Any relevant error messages or logs.
- Version of the package you're using.

---

## Development Setup

### 1. **Install Dependencies**
   - First, ensure you have all the dependencies installed:
     ```bash
     npm install
     ```

### 2. **Install Peer Dependencies for Development (Temporarily)**
   - Since this package has `mysql2` and `sequelize` as peer dependencies, you may need to install them temporarily for development or testing purposes while working on the code. To do so, run:
     ```bash
     npm install --save-dev mysql2 sequelize
     ```

   - **Important**: After contributing and before pushing your changes, **manually remove the temporary devDependencies** by:
     1. Opening your `package.json`.
     2. Removing `mysql2` and `sequelize` from the `devDependencies` section.
     3. Running `npm install` to reflect the changes in `node_modules`.

### 3. **Run the Application Locally**
   - Run the application locally or ensure everything works as expected by testing any feature or using the package.

### 4. **Commit and Push Changes**
   - Once you're done with your changes and testing, commit and push your contributions. Ensure that the temporary dependencies (`mysql2` and `sequelize`) were removed before pushing.

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

---

## Thank You!

Thank you for contributing to the **Sequelize Migration Generator**! 🎉 We look forward to your pull requests.
