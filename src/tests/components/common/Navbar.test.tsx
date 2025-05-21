import { render, screen } from "@testing-library/react";
import { describe, test as it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Navbar from "../../../components/common/Navbar";

// BrowserRouterでラップするヘルパー関数
const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe("Navbarコンポーネント", () => {
  it("アプリタイトルが表示されることを確認", () => {
    renderWithRouter(<Navbar />);

    // アプリケーションのタイトルが表示されていることを確認
    expect(screen.getByText("備品管理システム")).toBeInTheDocument();
  });

  it("ナビゲーションリンクが正しく表示されることを確認", () => {
    renderWithRouter(<Navbar />);

    // 新規登録リンクが存在することを確認
    expect(screen.getByText("新規登録")).toBeInTheDocument();
  });

  it("ナビゲーションリンクをクリックすると正しいパスに遷移することを確認", async () => {
    renderWithRouter(<Navbar />);
    const user = userEvent.setup();

    // 新規登録リンクをクリック
    const registerLink = screen.getByText(/新規登録/i);
    await user.click(registerLink);

    // location.pathnameを確認するには、モックまたは実際のルーティングテストが必要
    // この例ではリンクのhref属性を確認する簡易的な方法を示します
    expect(registerLink.closest("a")).toHaveAttribute("href", "/register");
  });

  it("スナップショットと一致することを確認", () => {
    const { asFragment } = renderWithRouter(<Navbar />);

    // コンポーネントのレンダリングが一貫していることを確認
    expect(asFragment()).toMatchSnapshot();
  });
});
