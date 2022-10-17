# Projet Billed

> Projet 9 du parcours Développeur web d'OpenClassrooms

Billed une entreprise qui produit des solutions Saas destinées aux équipes de ressources humaines.

## Objectifs

- Ecrire des tests unitaires avec JavaScript
- Débugger une application web avec le Chrome Debugger
- Rédiger un plan de test end-to-end manuel
- Ecrire des tests d'intégration avec JavaScript

## Liens

- [Lien vers le rapport](https://melodious-citrus-fe4.notion.site/Bug-report-1-Login-e8e4af1c626846b6addb2e29ccc0133b)
- [Lien vers le plan E2E employé](https://docs.google.com/document/d/1uncHF1Xg8YPJcFCpd5y2mzFgChb7ynlj/edit?usp=sharing&ouid=115999596046412147819&rtpof=true&sd=true)

# Debugs

## Debugs #1 - Login

**Comportements attendus**
Si un administrateur remplit correctement les champs du Login, il devrait naviguer sur la page Dashboard

**Solution**
Le selector prenait l'input "testid" de l'employé et non de l'admin

containers/Login.js

```js
handleSubmitAdmin = e => {
    e.preventDefault()
    const user = {
      type: "Admin",
      email: e.target.querySelector(`input[data-testid="admin-email-input"]`).value,
      password: e.target.querySelector(`input[data-testid="admin-password-input"]`).value,
      status: "connected"
    }
```

## Debugs #2 - Dashboard

**Comportements attendus**
Pourvoir déplier plusieurs listes, et consulter les tickets de chacune des deux listes.
**Solution**
N'appliquer l'eventListener que sur les bills dépliées
(Hint avec le console.log : On remarque que l'entiereté de l'array est appelé à chaque clic)

containers/Dashboard.js

```js
bills.forEach((bill) => {
  $(`#status-bills-container${this.index} #open-bill${bill.id}`).click((e) => this.handleEditTicket(e, bill, bills));
});
```

## Debug #3 - Trie des bills

**Comportements attendus**
Faire passer le test au vert en réparant la fonctionnalité

**Solution**
Trier le tableau avec un sort sur la partie view.
(Hint trouvé dans le test bills.js "Then bills should be ordered from earliest to latest")

views/BillsUI.js

```js
const rows = (data) => {
  return data && data.length
    ? data
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .map((bill) => row(bill))
        .join("")
    : "";
};
```

## Debug #4 - Upload des justificatifs

**Comportements attendus**
Empêcher la saisie d'un document qui a une extension différente de jpg, jpeg ou png au niveau du formulaire du fichier NewBill.js

**Solution**
Tester avec une regex le type de l'image entrée et vider le champs si ce n'est pas l'extenssion désirée. Une autre piste aurait pu d'être utiliser un array et tester avec un include

containers/NewBill.js

```js
handleChangeFile = (e) => {
    e.preventDefault();
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0];

    const regexFileType = new RegExp(`(jpg|jpeg|png)`, "i");
    const fileTypeTest = regexFileType.test(file.type);
    if (!fileTypeTest) e.target.value = "";

    const filePath = e.target.value.split(/\\/g);
    const fileName = filePath[filePath.length - 1];
    const formData = new FormData();
    const email = JSON.parse(localStorage.getItem("user")).email;

```
