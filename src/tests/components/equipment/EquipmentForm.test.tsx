import { render, screen, waitFor } from "@testing-library/react";
import { describe, test as it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import EquipmentForm from "../../../components/equipment/EquipmentForm";

// ナビゲーションとミューテーションフックのモック
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

// ミューテーションフックのモック
vi.mock("../../../hooks/useEquipment", () => ({
  useCreateEquipment: () => ({
    mutate: vi.fn(),
    isPending: false
  })
}));

// ヘルパー関数
const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe("EquipmentFormコンポーネント", () => {
  it("必須フィールドが空の場合にバリデーションエラーが表示されることを確認", async () => {
    // 準備
    const user = userEvent.setup();
    renderWithRouter(<EquipmentForm />);
    const submitButton = screen.getByRole("button", { name: /登録/ });

    // 実行
    const nameInput = screen.getByLabelText(/備品名/);
    await user.clear(nameInput);

    const categorySelect = screen.getByLabelText(/カテゴリ/);
    await user.selectOptions(categorySelect, "");

    const locationInput = screen.getByLabelText(/保管場所/);
    await user.clear(locationInput);

    const purchaseDateInput = screen.getByLabelText(/購入日/);
    await user.clear(purchaseDateInput);

    await user.click(submitButton);

    // 検証
    await waitFor(() => {
      expect(screen.getByText(/備品名は必須です/)).toBeInTheDocument();
      expect(
        screen.getByText(/有効なカテゴリを選択してください/)
      ).toBeInTheDocument();
      expect(screen.getByText(/保管場所は必須です/)).toBeInTheDocument();
    });
  });

  it("在庫数に無効な値を入力した場合にバリデーションエラーが表示されることを確認", async () => {
    // 準備
    const user = userEvent.setup();
    renderWithRouter(<EquipmentForm />);

    const quantityInput = screen.getByLabelText(/在庫数/);

    // 実行 - 無効な値を入力
    await user.clear(quantityInput);
    await user.type(quantityInput, "0"); // 0は最小値1より小さい

    // 入力欄からフォーカスを外す（onBlurを発火させる）
    await user.tab();

    // 検証 - エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText("最低1つ以上必要です")).toBeInTheDocument();
    });
  });

  it("すべてのフィールドが正しく入力された場合、フォームが送信されることを確認", async () => {
    // 準備
    const user = userEvent.setup();
    renderWithRouter(<EquipmentForm />);

    // 必須フィールドに有効な値を入力
    const nameInput = screen.getByLabelText(/備品名/);
    await user.clear(nameInput);
    await user.type(nameInput, "テスト備品");

    const categorySelect = screen.getByLabelText(/カテゴリ/);
    await user.selectOptions(categorySelect, "電子機器");

    const statusSelect = screen.getByLabelText(/ステータス/);
    await user.selectOptions(statusSelect, "利用可能");

    const quantityInput = screen.getByLabelText(/在庫数/);
    await user.clear(quantityInput);
    await user.type(quantityInput, "2");

    const locationInput = screen.getByLabelText(/保管場所/);
    await user.clear(locationInput);
    await user.type(locationInput, "テスト保管場所");

    const purchaseDateInput = screen.getByLabelText(/購入日/);
    await user.clear(purchaseDateInput);
    await user.type(purchaseDateInput, "05/19/2025");

    // 送信ボタンをクリック
    const submitButton = screen.getByRole("button", { name: /登録/ });
    await user.click(submitButton);

    // 検証 - エラーメッセージが表示されないことを確認
    await waitFor(() => {
      // エラーメッセージがないことを確認
      expect(screen.queryByText(/備品名は必須です/)).not.toBeInTheDocument();
      expect(
        screen.queryByText(/有効なカテゴリを選択してください/)
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/最低1つ以上必要です/)).not.toBeInTheDocument();
      expect(screen.queryByText(/保管場所は必須です/)).not.toBeInTheDocument();
    });
  });

  it("クリアボタンをクリックするとフォームがリセットされることを確認", async () => {
    // 準備
    const user = userEvent.setup();
    renderWithRouter(<EquipmentForm />);

    // 備品名
    const nameInput = screen.getByLabelText(/備品名/);
    await user.clear(nameInput);
    await user.type(nameInput, "テスト備品");

    // クリアボタンをクリック
    const clearButton = screen.getByRole("button", { name: /クリア/ });
    await user.click(clearButton);

    // 検証 - 入力がクリアされていることを確認
    expect(nameInput).toHaveValue("");

    // デフォルト値に戻っていることを確認
    expect(screen.getByLabelText(/カテゴリ/)).toHaveValue("AV機器・周辺機器");
    expect(screen.getByLabelText(/ステータス/)).toHaveValue("利用可能");
  });
});
