# GitSwitcher
Program that helps you switch between your git-hub, git-lab &amp; bitbucket  accounts.

****
# GitSwitcher CLI Command Guide

## 1. **Create a Table for Storing Accounts**
   - **Command:** `create <tableName>`
   - **Description:** Creates a new table for storing account credentials (e.g., for GitHub or GitLab).
   - **Example:** 
     ```bash
     npx gitswitcher create github
     ```
     This command creates a table named `github`.

## 2. **Delete a Table**
   - **Command:** `delete-table <tableName>`
   - **Description:** Deletes a table from the database.
   - **Example:**
     ```bash
     npx gitswitcher delete-table github
     ```
     This command deletes the table named `github`.

## 3. **Add an Account to a Table**
   - **Command:** `add <tableName> <name> <email> [token]`
   - **Description:** Adds a new account to the specified table. An optional `token` parameter can be provided to store a token or password.
   - **Example (without token):**
     ```bash
     npx gitswitcher add github "DenisYasyuchenya" "yasyuchenya1@gmail.com"
     ```
   - **Example (with token):**
     ```bash
     npx gitswitcher add gitlab "DenisYasyuchenya" "yasyuchenya1@gmail.com" "your_personal_access_token"
     ```

## 4. **Delete an Account from a Table**
   - **Command:** `delete-account <tableName> <identifier>`
   - **Description:** Deletes an account from the specified table using either its ID or name.
   - **Example:**
     ```bash
     npx gitswitcher delete-account github 1
     ```
     This command deletes the account with ID `1` from the `github` table.

## 5. **Show All Accounts in a Table**
   - **Command:** `show <tableName>`
   - **Description:** Displays a list of all accounts in the specified table.
   - **Example:**
     ```bash
     npx gitswitcher show github
     ```
     This command displays all accounts stored in the `github` table.

     **Output Example:**
     ```bash
     Accounts in table 'github':
     1: DenisYasyuchenya
     2: AnotherUser
     3: ExampleUser
     ```

## 6. **Show All Tables (Folders) in the Database**
   - **Command:** `show-folders`
   - **Description:** Lists all tables in the database, excluding system tables.
   - **Example:**
     ```bash
     npx gitswitcher show-folders
     ```
     This command displays all tables (e.g., `github`, `gitlab`).

     **Output Example:**
     ```bash
     Your folders:
     github
     gitlab
     ```

## 7. **Switch to an Account**
   - **Command:** `use <tableName> <id>`
   - **Description:** Switches the current Git configuration to the specified account by its ID.
   - **Example:**
     ```bash
     npx gitswitcher use github 1
     ```
     This command switches the current Git configuration to the account with ID `1` in the `github` table.
