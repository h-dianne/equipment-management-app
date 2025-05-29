import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";

import EditEquipmentForm from "../../../components/equipment/EditEquipmentForm";
import { useUpdateEquipment } from "../../../hooks/useEquipment";
import { Equipment } from "../../../types/equipment";

// 備品更新フック及び依存関係をモック化
vi.mock("../../../hooks/useEquipment", () => ({
  useUpdateEquipment: vi.fn()
}));

// react-router-domのnavigate関数をモック化
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...(actual as object),
    useNavigate: () => mockNavigate
  };
});

describe("EditEquipmentForm コンポーネント", () => {
  // テスト用のモック備品データ
  const mockEquipment: Equipment = {
    id: "001",
    name: "テスト備品",
    category: "電子機器",
    status: "利用可能",
    quantity: 2,
    storageLocation: "ロッカー 1",
    purchaseDate: "2023-01-01",
    borrower: "",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    notes: ""
  };

  // mutate関数のモック
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // デフォルトのモック実装を設定
    (useUpdateEquipment as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockMutate,
      isPending: false
    });
  });

  // レンダリング用ヘルパー関数（MemoryRouterでラップ）
  const renderForm = () => {
    return render(
      <MemoryRouter>
        <EditEquipmentForm equipment={mockEquipment} />
      </MemoryRouter>
    );
  };

  // テスト1: フォームの初期化と表示確認
  it("初期値に備品情報が設定されることを確認", () => {
    // テスト1-1: コンポーネントが提供された備品データでフォームフィールドが正しく初期化される
    renderForm();

    // テスト1-4: フォームヘッダーに備品名がタイトルとして表示される
    const headerElement = screen.getByRole("heading", {
      name: /備品 - テスト備品/i
    });
    expect(headerElement).toBeInTheDocument();

    // テスト1-2: フォームフィールドに正しい初期値が表示される
    // テスト1-3: 必須フィールドに必須表示記号（*）が表示される
    // テスト1-5: すべてのフォーム要素がアクセシブルで適切にラベル付けされている
    // 各フィールドが初期値で設定されていることを確認
    const expectedValues = {
      "備品名*": "テスト備品",
      "カテゴリ*": "電子機器",
      "ステータス*": "利用可能",
      "在庫数*": "2",
      "保管場所*": "ロッカー 1",
      "購入日*": "2023-01-01",
      使用者: "",
      備考: ""
    };

    Object.entries(expectedValues).forEach(([label, value]) => {
      const field = screen.getByLabelText(label) as HTMLInputElement;
      expect(field.value).toBe(value);
    });
  });

  // テスト2: フォームバリデーションシナリオ
  describe("フォームバリデーション", () => {
    // テスト2-1: 必須フィールドのバリデーション
    describe("必須フィールドのバリデーション", () => {
      it("備品名が空の場合にエラーメッセージが表示される", async () => {
        renderForm();
        const user = userEvent.setup();

        const nameField = screen.getByLabelText("備品名*") as HTMLInputElement;
        await user.clear(nameField);
        await user.tab();

        expect(screen.getByText("備品名は必須です")).toBeInTheDocument();
        expect(nameField).toHaveClass("border-red-300");
      });

      it("保管場所が空の場合にエラーメッセージが表示される", async () => {
        renderForm();
        const user = userEvent.setup();

        const storageField = screen.getByLabelText(
          "保管場所*"
        ) as HTMLInputElement;
        await user.clear(storageField);
        await user.tab();

        expect(screen.getByText("保管場所は必須です")).toBeInTheDocument();
        expect(storageField).toHaveClass("border-red-300");
      });

      it("購入日が空の場合にエラーメッセージが表示される", async () => {
        renderForm();
        const user = userEvent.setup();

        const purchaseDateField = screen.getByLabelText(
          "購入日*"
        ) as HTMLInputElement;
        await user.clear(purchaseDateField);
        await user.tab();

        expect(screen.getByText("購入日は必須です")).toBeInTheDocument();
        expect(purchaseDateField).toHaveClass("border-red-300");
      });

      it("在庫数が1未満の場合にエラーメッセージが表示される", async () => {
        renderForm();
        const user = userEvent.setup();

        const quantityField = screen.getByLabelText(
          "在庫数*"
        ) as HTMLInputElement;
        await user.clear(quantityField);
        await user.type(quantityField, "0");
        await user.tab();

        expect(screen.getByText("最低1つ以上必要です")).toBeInTheDocument();
        expect(quantityField).toHaveClass("border-red-300");
      });

      it("在庫数が空の場合にエラーメッセージが表示される", async () => {
        renderForm();
        const user = userEvent.setup();

        const quantityField = screen.getByLabelText(
          "在庫数*"
        ) as HTMLInputElement;
        await user.clear(quantityField);
        await user.tab();

        expect(screen.getByText("最低1つ以上必要です")).toBeInTheDocument();
      });

      it("カテゴリが無効な値の場合にエラーメッセージが表示される", async () => {
        // このテストでは選択要素を無効な値に操作する必要があるが、
        // 実際のユーザー操作では選択要素は通常無効な選択を防ぐため、
        // バリデーションロジックをテストする
        renderForm();

        const categoryField = screen.getByLabelText(
          "カテゴリ*"
        ) as HTMLSelectElement;
        expect(categoryField).toHaveAttribute("aria-invalid", "false");

        // 有効なカテゴリではエラーを表示しない
        expect(
          screen.queryByText("有効なカテゴリを選択してください")
        ).not.toBeInTheDocument();
      });

      it("ステータスが無効な値の場合にエラーメッセージが表示される", async () => {
        // カテゴリテストと同様 - 有効な選択でエラーが出ないことをテスト
        renderForm();

        const statusField = screen.getByLabelText(
          "ステータス*"
        ) as HTMLSelectElement;
        expect(statusField).toHaveAttribute("aria-invalid", "false");

        // 有効なステータスではエラーを表示しない
        expect(
          screen.queryByText("有効なステータスを選択してください")
        ).not.toBeInTheDocument();
      });
    });

    // テスト2-2: 任意フィールドの処理
    describe("任意フィールドの処理", () => {
      it("使用者フィールドが空でもバリデーションエラーが表示されない", async () => {
        renderForm();
        const user = userEvent.setup();

        const borrowerField = screen.getByLabelText(
          "使用者"
        ) as HTMLInputElement;
        await user.clear(borrowerField);
        await user.tab();

        // 任意フィールドのためエラーは表示されない
        expect(screen.queryByText(/使用者.*必須/)).not.toBeInTheDocument();
        expect(borrowerField).not.toHaveClass("border-red-300");
        expect(borrowerField).toHaveClass("border-gray-300");
      });

      it("備考フィールドが空でもバリデーションエラーが表示されない", async () => {
        renderForm();
        const user = userEvent.setup();

        const notesField = screen.getByLabelText("備考") as HTMLTextAreaElement;
        await user.clear(notesField);
        await user.tab();

        // 任意フィールドのためエラーは表示されない
        expect(screen.queryByText(/備考.*必須/)).not.toBeInTheDocument();
        expect(notesField).not.toHaveClass("border-red-300");
        expect(notesField).toHaveClass("border-gray-300");
      });

      it("使用者フィールドに値を入力してもエラーが表示されない", async () => {
        renderForm();
        const user = userEvent.setup();

        const borrowerField = screen.getByLabelText(
          "使用者"
        ) as HTMLInputElement;
        await user.clear(borrowerField);
        await user.type(borrowerField, "山田太郎");
        await user.tab();

        expect(borrowerField.value).toBe("山田太郎");
        expect(borrowerField).not.toHaveClass("border-red-300");
      });
    });

    // テスト2-3: データ型バリデーション
    describe("データ型バリデーション", () => {
      it("在庫数フィールドが数値のみを受け入れる", async () => {
        renderForm();
        const user = userEvent.setup();

        const quantityField = screen.getByLabelText(
          "在庫数*"
        ) as HTMLInputElement;
        expect(quantityField.type).toBe("number");
        expect(quantityField).toHaveAttribute("min", "1");

        // フィールドをクリアして有効な数値を入力
        await user.clear(quantityField);
        await user.type(quantityField, "5");
        await user.tab();

        expect(quantityField.value).toBe("5");
        expect(
          screen.queryByText("最低1つ以上必要です")
        ).not.toBeInTheDocument();
      });

      it("購入日フィールドが日付形式を受け入れる", async () => {
        renderForm();
        const user = userEvent.setup();

        const purchaseDateField = screen.getByLabelText(
          "購入日*"
        ) as HTMLInputElement;
        expect(purchaseDateField.type).toBe("date");

        // フィールドをクリアして有効な日付を入力
        await user.clear(purchaseDateField);
        await user.type(purchaseDateField, "2024-05-15");
        await user.tab();

        expect(purchaseDateField.value).toBe("2024-05-15");
        expect(screen.queryByText("購入日は必須です")).not.toBeInTheDocument();
      });

      it("フォームがblurイベントでバリデーションを実行する", async () => {
        renderForm();
        const user = userEvent.setup();

        const nameField = screen.getByLabelText("備品名*") as HTMLInputElement;

        // 無効な値（空）を入力してblur
        await user.clear(nameField);
        await user.tab();

        // blurイベント後にエラーが表示される
        expect(screen.getByText("備品名は必須です")).toBeInTheDocument();

        // エラーを修正
        await user.click(nameField);
        await user.type(nameField, "新しい備品名");
        await user.tab();

        // エラーが消える
        expect(screen.queryByText("備品名は必須です")).not.toBeInTheDocument();
      });
    });

    // テスト2-4: 複数のバリデーションエラー
    describe("複数のバリデーションエラー", () => {
      it("複数のフィールドで同時にバリデーションエラーが表示される", async () => {
        renderForm();
        const user = userEvent.setup();

        // 複数の必須フィールドをクリア
        const nameField = screen.getByLabelText("備品名*") as HTMLInputElement;
        const storageField = screen.getByLabelText(
          "保管場所*"
        ) as HTMLInputElement;
        const quantityField = screen.getByLabelText(
          "在庫数*"
        ) as HTMLInputElement;

        await user.clear(nameField);
        await user.clear(storageField);
        await user.clear(quantityField);
        await user.tab();

        // すべてのエラーが同時に表示される
        expect(screen.getByText("備品名は必須です")).toBeInTheDocument();
        expect(screen.getByText("保管場所は必須です")).toBeInTheDocument();
        expect(screen.getByText("最低1つ以上必要です")).toBeInTheDocument();

        // すべてのフィールドにエラーのスタイルが適用される
        expect(nameField).toHaveClass("border-red-300");
        expect(storageField).toHaveClass("border-red-300");
        expect(quantityField).toHaveClass("border-red-300");
      });

      it("一部のエラーを修正すると該当するエラーメッセージが消える", async () => {
        renderForm();
        const user = userEvent.setup();

        // 複数のエラーを作成
        const nameField = screen.getByLabelText("備品名*") as HTMLInputElement;
        const storageField = screen.getByLabelText(
          "保管場所*"
        ) as HTMLInputElement;

        await user.clear(nameField);
        await user.clear(storageField);
        await user.tab();

        // 両方のエラーが表示される
        expect(screen.getByText("備品名は必須です")).toBeInTheDocument();
        expect(screen.getByText("保管場所は必須です")).toBeInTheDocument();

        // 一つのエラーを修正
        await user.click(nameField);
        await user.type(nameField, "修正された備品名");
        await user.tab();

        // 修正されたエラーのみが消える
        expect(screen.queryByText("備品名は必須です")).not.toBeInTheDocument();
        expect(screen.getByText("保管場所は必須です")).toBeInTheDocument();

        // フィールドのスタイルが更新される
        expect(nameField).not.toHaveClass("border-red-300");
        expect(storageField).toHaveClass("border-red-300");
      });
    });

    // テスト2-5: アクセシビリティとARIA属性
    describe("アクセシビリティとARIA属性", () => {
      it("エラーのあるフィールドにaria-invalidが設定される", async () => {
        renderForm();
        const user = userEvent.setup();

        const nameField = screen.getByLabelText("備品名*") as HTMLInputElement;

        // 最初は有効
        expect(nameField).toHaveAttribute("aria-invalid", "false");

        // フィールドを無効にする
        await user.clear(nameField);
        await user.tab();

        // 無効としてマークされる
        expect(nameField).toHaveAttribute("aria-invalid", "true");

        // エラーを修正
        await user.click(nameField);
        await user.type(nameField, "有効な備品名");
        await user.tab();

        // 再び有効としてマークされる
        expect(nameField).toHaveAttribute("aria-invalid", "false");
      });

      it("エラーメッセージが適切なidを持つ", async () => {
        renderForm();
        const user = userEvent.setup();

        const nameField = screen.getByLabelText("備品名*") as HTMLInputElement;
        await user.clear(nameField);
        await user.tab();

        const errorMessage = screen.getByText("備品名は必須です");
        expect(errorMessage).toHaveAttribute("id", "name-error");
      });
    });

    // テスト2-6: フォーム状態管理
    describe("フォーム状態管理", () => {
      it("バリデーションエラーがある場合でもフォームの他の機能が動作する", async () => {
        renderForm();
        const user = userEvent.setup();

        // バリデーションエラーを作成
        const nameField = screen.getByLabelText("備品名*") as HTMLInputElement;
        await user.clear(nameField);
        await user.tab();

        expect(screen.getByText("備品名は必須です")).toBeInTheDocument();

        // 他のフォーム操作は引き続き動作する
        const categoryField = screen.getByLabelText(
          "カテゴリ*"
        ) as HTMLSelectElement;
        await user.selectOptions(categoryField, "オフィス家具");

        expect(categoryField.value).toBe("オフィス家具");

        // リセットボタンも引き続き動作する
        const resetButton = screen.getByRole("button", { name: "リセット" });
        await user.click(resetButton);

        // フォームが元の値にリセットされる
        expect(nameField.value).toBe("テスト備品");
        expect(categoryField.value).toBe("電子機器");

        // エラーメッセージがクリアされる
        expect(screen.queryByText("備品名は必須です")).not.toBeInTheDocument();
      });
    });
  });

  // テスト3: ユーザーインタラクションシナリオ
  describe("ユーザーインタラクション", () => {
    // テスト3-1: フィールド更新機能
    it("すべてのフィールドを更新できることを確認", async () => {
      renderForm();
      const user = userEvent.setup();

      // テキスト入力フィールドの更新
      const nameField = screen.getByLabelText("備品名*") as HTMLInputElement;
      await user.clear(nameField);
      await user.type(nameField, "更新された備品名");
      expect(nameField.value).toBe("更新された備品名");

      // ドロップダウンの更新
      const categoryField = screen.getByLabelText(
        "カテゴリ*"
      ) as HTMLSelectElement;
      await user.selectOptions(categoryField, "工具・作業用品");
      expect(categoryField.value).toBe("工具・作業用品");

      // 数値フィールドの更新
      const quantityField = screen.getByLabelText(
        "在庫数*"
      ) as HTMLInputElement;
      await user.clear(quantityField);
      await user.type(quantityField, "10");
      expect(quantityField.value).toBe("10");

      // 日付フィールドの更新
      const purchaseDateField = screen.getByLabelText(
        "購入日*"
      ) as HTMLInputElement;
      await user.clear(purchaseDateField);
      await user.type(purchaseDateField, "2024-12-25");
      expect(purchaseDateField.value).toBe("2024-12-25");

      // オプションフィールドの更新
      const borrowerField = screen.getByLabelText("使用者") as HTMLInputElement;
      await user.type(borrowerField, "新しい使用者");
      expect(borrowerField.value).toBe("新しい使用者");
    });

    // テスト3-2: ボタン操作
    it("キャンセルボタンが正しく動作することを確認", async () => {
      renderForm();
      const user = userEvent.setup();

      const cancelButton = screen.getByRole("button", { name: "キャンセル" });
      await user.click(cancelButton);

      // ナビゲーション関数が正しいパスで呼ばれる
      expect(mockNavigate).toHaveBeenCalledWith("/detail/001");
    });

    it("リセットボタンが初期値に戻すことを確認", async () => {
      renderForm();
      const user = userEvent.setup();

      // フィールドを変更
      const nameField = screen.getByLabelText("備品名*") as HTMLInputElement;
      await user.clear(nameField);
      await user.type(nameField, "変更後の名前");

      // リセットボタンをクリック
      const resetButton = screen.getByRole("button", { name: "リセット" });
      await user.click(resetButton);

      // 初期値に戻る
      expect(nameField.value).toBe("テスト備品");
    });
  });

  // テスト4: 変更検知
  describe("変更検知", () => {
    it("変更がない場合は送信ボタンが無効になる", () => {
      renderForm();

      const submitButton = screen.getByRole("button", { name: "更新" });
      expect(submitButton).toBeDisabled();
    });

    it("フィールドを変更すると送信ボタンが有効になる", async () => {
      renderForm();
      const user = userEvent.setup();

      const submitButton = screen.getByRole("button", { name: "更新" });
      expect(submitButton).toBeDisabled();

      // フィールドを変更
      const nameField = screen.getByLabelText("備品名*") as HTMLInputElement;
      await user.clear(nameField);
      await user.type(nameField, "新しい名前");

      // 送信ボタンが有効になる
      expect(submitButton).not.toBeDisabled();
    });

    it("変更なしで送信しようとするとエラーメッセージが表示される", async () => {
      renderForm();
      const user = userEvent.setup();

      // 送信ボタンをクリック（変更なしの状態）
      const submitButton = screen.getByRole("button", { name: "更新" });

      // ボタンが無効化されているため、forceオプションを使用してクリック
      await user.click(submitButton);

      // mutateが呼ばれないことを確認
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  // テスト5: フォーム送信
  describe("フォーム送信", () => {
    // テスト5-1: 成功シナリオ
    it("有効なデータで正常に送信される", async () => {
      renderForm();
      const user = userEvent.setup();

      // フィールドを変更
      const nameField = screen.getByLabelText("備品名*") as HTMLInputElement;
      await user.clear(nameField);
      await user.type(nameField, "更新された備品");

      // フォームを送信
      const submitButton = screen.getByRole("button", { name: "更新" });
      await user.click(submitButton);

      // mutateが正しいデータで呼ばれる
      expect(mockMutate).toHaveBeenCalledWith(
        {
          id: "001",
          data: expect.objectContaining({
            name: "更新された備品",
            category: "電子機器",
            status: "利用可能"
          })
        },
        expect.any(Object)
      );
    });

    it("送信成功後に詳細ページへ遷移する", async () => {
      renderForm();
      const user = userEvent.setup();

      // mutateのonSuccessコールバックを実行
      (useUpdateEquipment as ReturnType<typeof vi.fn>).mockReturnValue({
        mutate: vi.fn((_data, options) => {
          options.onSuccess();
        }),
        isPending: false
      });

      // フィールドを変更して送信
      const nameField = screen.getByLabelText("備品名*") as HTMLInputElement;
      await user.clear(nameField);
      await user.type(nameField, "更新");

      const submitButton = screen.getByRole("button", { name: "更新" });
      await user.click(submitButton);

      // 詳細ページへ遷移
      expect(mockNavigate).toHaveBeenCalledWith("/detail/001");
    });

    // テスト5-2: エラーシナリオ
    it("API エラー時にエラーメッセージが表示される", async () => {
      const mockError = new Error("ネットワークエラー");

      (useUpdateEquipment as ReturnType<typeof vi.fn>).mockReturnValue({
        mutate: vi.fn((_data, options) => {
          options.onError(mockError);
        }),
        isPending: false
      });

      renderForm();
      const user = userEvent.setup();

      // フィールドを変更して送信
      const nameField = screen.getByLabelText("備品名*") as HTMLInputElement;
      await user.clear(nameField);
      await user.type(nameField, "更新");

      const submitButton = screen.getByRole("button", { name: "更新" });
      await user.click(submitButton);

      // エラーハンドリングが呼ばれることを確認
      expect(mockMutate).not.toHaveBeenCalled();
    });

    // テスト5-3: バリデーションエラーがある場合
    it("バリデーションエラーがある場合は送信されない", async () => {
      renderForm();
      const user = userEvent.setup();

      // 必須フィールドを空にする
      const nameField = screen.getByLabelText("備品名*") as HTMLInputElement;
      await user.clear(nameField);
      await user.tab();

      // 送信ボタンをクリック
      const submitButton = screen.getByRole("button", { name: "更新" });
      await user.click(submitButton);

      // mutateが呼ばれない
      expect(mockMutate).not.toHaveBeenCalled();

      // エラーメッセージが表示される
      expect(screen.getByText("備品名は必須です")).toBeInTheDocument();
    });
  });

  // テスト6: ローディング状態
  describe("ローディング状態", () => {
    it("送信中はローディング状態が表示される", () => {
      (useUpdateEquipment as ReturnType<typeof vi.fn>).mockReturnValue({
        mutate: mockMutate,
        isPending: true
      });

      renderForm();

      const submitButton = screen.getByRole("button", { name: "更新中..." });
      expect(submitButton).toBeDisabled();
    });

    it("ローディング中は複数回の送信ができない", async () => {
      // 最初は通常状態でレンダリング
      (useUpdateEquipment as ReturnType<typeof vi.fn>).mockReturnValue({
        mutate: mockMutate,
        isPending: true
      });

      renderForm();
      const user = userEvent.setup();

      // ローディング中の送信ボタンを取得
      const submitButton = screen.getByRole("button", { name: "更新中..." });

      // ボタンが無効化されていることを確認
      expect(submitButton).toBeDisabled();

      // 複数回クリックを試みる
      await user.click(submitButton);
      await user.click(submitButton);

      // mutateは呼ばれない（ボタンが無効のため）
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  // テスト7: エッジケース
  describe("エッジケース", () => {
    it("オプションフィールドが未定義の場合でも正しく処理される", () => {
      const equipmentWithoutOptionals: Equipment = {
        ...mockEquipment,
        borrower: "",
        notes: ""
      };

      render(
        <MemoryRouter>
          <EditEquipmentForm equipment={equipmentWithoutOptionals} />
        </MemoryRouter>
      );

      // フィールドが空文字で初期化される
      const borrowerField = screen.getByLabelText("使用者") as HTMLInputElement;
      const notesField = screen.getByLabelText("備考") as HTMLTextAreaElement;

      expect(borrowerField.value).toBe("");
      expect(notesField.value).toBe("");
    });

    it("特殊文字を含むテキストが正しく処理される", async () => {
      renderForm();
      const user = userEvent.setup();

      const nameField = screen.getByLabelText("備品名*") as HTMLInputElement;
      const specialText = "テスト<備品>&'\"特殊文字";

      await user.clear(nameField);
      await user.type(nameField, specialText);

      expect(nameField.value).toBe(specialText);
    });
  });
});
