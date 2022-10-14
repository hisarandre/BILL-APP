/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { screen, waitFor, fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import store from "../__mocks__/store";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon).toHaveClass("active-icon");
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });

  describe("When I click on the icon eye", () => {
    test("Then a modal should open", () => {
      document.body.innerHTML = BillsUI({ data: bills });

      $.fn.modal = jest.fn();

      const billsList = new Bills({
        document,
        onNavigate,
        store,
        localStorageMock,
      });

      const eye = screen.getAllByTestId("icon-eye")[0];
      const handleClickIconEye = jest.fn(billsList.handleClickIconEye(eye));
      eye.addEventListener("click", handleClickIconEye);
      userEvent.click(eye);
      expect(handleClickIconEye).toHaveBeenCalled();

      const modale = screen.getByTestId("modaleFile");
      expect(modale).toBeTruthy();
    });
  });

  describe("When I click on the newbill button", () => {
    test("It should display the form", () => {
      document.body.innerHTML = BillsUI({ data: bills });

      $.fn.modal = jest.fn();

      const billsList = new Bills({
        document,
        onNavigate,
        store,
        localStorageMock,
      });
    });
  });
});

// test d'intégration GET
describe("Given I am a user connected as an employee", () => {
  describe("When I navigate to Bills Page", () => {
    test("fetches bills from mock API GET", async () => {
      const storeSpy = jest.spyOn(store, "bills");
      const userBills = await store.bills().list();
      expect(storeSpy).toHaveBeenCalled();
      expect(userBills.length).toBe(4);
    });

    test("fetches bills from an API and fails with 404 message error", async () => {
      store.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"));
          },
        };
      });

      document.body.innerHTML = BillsUI({ error: "Erreur 404" });
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });

    test("fetches bills from an API and fails with 404 message error", async () => {
      store.bills.mockImplementationOnce(() => {
        return {
          list: () => {
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
