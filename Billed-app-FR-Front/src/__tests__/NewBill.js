/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom/extend-expect";
import { screen, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import BillsUI from "../views/BillsUI.js";
import { ROUTES } from "../constants/routes.js";
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

// test d'intégration POST
describe("Given I am a user connected as an employee", () => {
  describe("When I create a new bill", () => {
    test("fetches update bill API POST", async () => {
      const storeSpy = jest.spyOn(store, "bills");
      const bill = await store.bills().update();

      expect(storeSpy).toHaveBeenCalledTimes(1);
      expect(bill.name).toBe("encore");
    });

    test("fetches bills from an API POST and fails with 404 message error", async () => {
      //simule a rejected promise
      store.bills.mockImplementationOnce(() => {
        return {
          udapte: () => {
            return Promise.reject(new Error("Erreur 404"));
          },
        };
      });

      document.body.innerHTML = BillsUI({ error: "Erreur 404" });
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });

    test("fetches bills from an API POST and fails with 500 message error", async () => {
      store.bills.mockImplementationOnce(() => {
        return {
          udapte: () => {
            return Promise.reject(new Error("Erreur 500"));
          },
        };
      });

      document.body.innerHTML = BillsUI({ error: "Erreur 500" });
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
