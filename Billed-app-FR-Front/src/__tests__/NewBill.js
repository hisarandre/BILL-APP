/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { screen, waitFor, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../__mocks__/store";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I upload a png or jpg/jpeg file", () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      const html = NewBillUI();
      document.body.innerHTML = html;

      const newBill = new NewBill({
        document,
        onNavigate: (pathname) => (document.body.innerHTML = ROUTES({ pathname })),
        store,
        localStorageMock,
      });

      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const inputFile = screen.getByTestId("file");
      inputFile.addEventListener("change", handleChangeFile);
      fireEvent.change(inputFile, {
        target: {
          files: [new File(["test-bill.jpg"], "test-bill.jpg", { type: "image/jpg" })],
        },
      });

      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].type).toBe("image/jpg");
    });

    test("Then I upload a file with the wrong extension", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      const newBill = new NewBill({
        document,
        onNavigate: (pathname) => (document.body.innerHTML = ROUTES({ pathname })),
        store,
        localStorageMock,
      });

      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const inputFile = screen.getByTestId("file");
      inputFile.addEventListener("change", handleChangeFile);
      fireEvent.change(inputFile, {
        target: {
          files: [new File(["test-bill.svg"], "test-bill.svg", { type: "image/svg" })],
        },
      });
      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].type).toBe("image/svg");
    });

    test("Then I submit the form with correct fields", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      const newBill = new NewBill({
        document,
        onNavigate: (pathname) => (document.body.innerHTML = ROUTES({ pathname })),
        store,
        localStorageMock,
      });

      const handleSubmit = jest.fn(newBill.handleSubmit);
      const newBillForm = screen.getByTestId("form-new-bill");
      newBillForm.addEventListener("submit", handleSubmit);
      fireEvent.submit(newBillForm);
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});

// test d'intégration GET
describe("Given I am a user connected as an employee", () => {
  describe("When I create a new bill", () => {
    test("...", async () => {
      //...
    });

    test("... 404 message error", async () => {
      //error 404
    });

    test("... 500 message error", async () => {
      //error500
    });
  });
});
