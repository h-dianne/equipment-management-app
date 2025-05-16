import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, test, expect, vi } from "vitest";
import Layout from "../../../components/common/Layout";

// Outletコンポーネントをモック化
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet-content">Page Content</div>
  };
});

describe("Layoutコンポーネント", () => {
  test("ナビゲーションバーが正しくレンダリングされることを確認", () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );

    // ナビゲーションバーのタイトルが表示されることを確認
    expect(screen.getByText("備品管理システム")).toBeInTheDocument();
  });

  test("Outletコンテンツが正しくレンダリングされることを確認", () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );

    // アウトレットのコンテンツが適切にレンダリングされることを確認
    expect(screen.getByTestId("outlet-content")).toBeInTheDocument();
    expect(screen.getByText("Page Content")).toBeInTheDocument();
  });

  test("フッターが現在の年を含めて表示されることを確認", () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );

    // フッターが現在の年を含めて表示されることを確認
    const currentYear = new Date().getFullYear().toString();
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveTextContent(`© ${currentYear} 備品管理システム`);
  });

  test("適切なレイアウトが存在することを確認", () => {
    const { container } = render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );

    // レイアウトの基本構造（ナビゲーション、メイン、フッター）が正しいことを確認
    const main = container.querySelector("main");
    const footer = container.querySelector("footer");

    expect(main).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
    expect(main).toHaveClass("container");
    expect(footer).toHaveClass("bg-gray-800");
  });

  test("スナップショットと一致することを確認", () => {
    const { asFragment } = render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );

    // コンポーネントのレンダリングが一貫していることを確認
    expect(asFragment()).toMatchSnapshot();
  });
});
