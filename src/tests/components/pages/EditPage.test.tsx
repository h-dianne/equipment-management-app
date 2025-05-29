import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import DetailPage from "../../../pages/DetailPage";
import { useEquipmentById } from "../../../hooks/useEquipment";
import useEquipmentStore from "../../../stores/equipmentStore";
import { Equipment } from "../../../types/equipment";

// モックの設定
vi.mock("../../../hooks/useEquipment", () => ({
  useEquipmentById: vi.fn()
}));

vi.mock("../../../stores/equipmentStore", () => ({
  default: vi.fn()
}));

// ナビゲーション関数のモック
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...(actual as object),
    useNavigate: () => mockNavigate
  };
});

describe("DetailPage コンポーネント", () => {
  // テストデータ
  const mockEquipment: Equipment = {
    id: "001",
    name: "MacBook Pro",
    category: "電子機器",
    status: "利用可能",
    quantity: 3,
    storageLocation: "会議室A",
    purchaseDate: "2023-01-15",
    borrower: "山田太郎",
    createdAt: "2023-01-15T09:00:00.000Z",
    updatedAt: "2023-12-20T14:30:00.000Z",
    notes: "開発チーム用"
  };

  // ストア関数のモック
  const mockSelectEquipment = vi.fn();
  const mockAddToRecentlyViewed = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // デフォルトのモック設定
    const mockStore = useEquipmentStore as unknown as ReturnType<typeof vi.fn>;
    mockStore.mockReturnValue({
      selectEquipment: mockSelectEquipment,
      addToRecentlyViewed: mockAddToRecentlyViewed
    });
  });

  // ヘルパー関数：DetailPageをルーティング設定でレンダリング
  const renderDetailPage = (id: string = "001") => {
    return render(
      <MemoryRouter initialEntries={[`/detail/${id}`]}>
        <Routes>
          <Route path="/detail/:id" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  describe("データ読み込み状態", () => {
    it("ローディング中は読み込み中メッセージが表示される", () => {
      // ローディング状態のモック
      (useEquipmentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null
      });

      renderDetailPage();

      // ローディングメッセージの確認
      expect(screen.getByText("読み込み中...")).toBeInTheDocument();

      // 他の要素が表示されていないことを確認
      expect(screen.queryByText("備品詳細")).not.toBeInTheDocument();
    });

    it("データ取得成功時に備品情報が表示される", async () => {
      // 成功状態のモック
      (useEquipmentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockEquipment,
        isLoading: false,
        isError: false,
        error: null
      });

      renderDetailPage();

      // ヘッダーの確認
      expect(screen.getByText("備品詳細")).toBeInTheDocument();

      // 備品名とステータスの確認
      expect(screen.getByText("MacBook Pro")).toBeInTheDocument();
      expect(screen.getByText("利用可能")).toBeInTheDocument();

      // 詳細情報の確認
      expect(screen.getByText("カテゴリ")).toBeInTheDocument();
      expect(screen.getByText("電子機器")).toBeInTheDocument();

      expect(screen.getByText("数量")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();

      expect(screen.getByText("保管場所")).toBeInTheDocument();
      expect(screen.getByText("会議室A")).toBeInTheDocument();

      expect(screen.getByText("使用者")).toBeInTheDocument();
      expect(screen.getByText("山田太郎")).toBeInTheDocument();

      // 日付フィールドの確認
      expect(screen.getByText("登録日")).toBeInTheDocument();
      expect(screen.getByText("更新日")).toBeInTheDocument();
    });

    it("使用者が未登録の場合は「登録されていません」と表示される", () => {
      const equipmentWithoutBorrower = {
        ...mockEquipment,
        borrower: ""
      };

      (useEquipmentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: equipmentWithoutBorrower,
        isLoading: false,
        isError: false,
        error: null
      });

      renderDetailPage();

      expect(screen.getByText("登録されていません")).toBeInTheDocument();
    });

    it("更新日がない場合は更新日フィールドが表示されない", () => {
      const equipmentWithoutUpdate = {
        ...mockEquipment,
        updatedAt: undefined
      };

      (useEquipmentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: equipmentWithoutUpdate,
        isLoading: false,
        isError: false,
        error: null
      });

      renderDetailPage();

      // 登録日は表示される
      expect(screen.getByText("登録日")).toBeInTheDocument();

      // 更新日は表示されない
      expect(screen.queryByText("更新日")).not.toBeInTheDocument();
    });
  });

  describe("エラー処理", () => {
    it("エラー時にエラーメッセージが表示される", () => {
      const mockError = new Error("備品データの取得に失敗しました");

      (useEquipmentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: mockError
      });

      renderDetailPage();

      // エラーメッセージの確認
      expect(
        screen.getByText("エラー: 備品データの取得に失敗しました")
      ).toBeInTheDocument();

      // 戻るボタンの確認
      expect(screen.getByRole("button", { name: "戻る" })).toBeInTheDocument();
    });

    it("エラー時の戻るボタンで前のページに戻る", async () => {
      const mockError = new Error("エラー");

      (useEquipmentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: mockError
      });

      renderDetailPage();
      const user = userEvent.setup();

      const backButton = screen.getByRole("button", { name: "戻る" });
      await user.click(backButton);

      // navigate(-1) が呼ばれることを確認
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it("データが見つからない場合の警告メッセージが表示される", () => {
      (useEquipmentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null
      });

      renderDetailPage();

      // 警告メッセージの確認
      expect(
        screen.getByText("指定された備品が見つかりませんでした。")
      ).toBeInTheDocument();

      // 一覧に戻るボタンの確認
      expect(
        screen.getByRole("button", { name: "商品一覧に戻る" })
      ).toBeInTheDocument();
    });

    it("データが見つからない場合のボタンでホームページに戻る", async () => {
      (useEquipmentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null
      });

      renderDetailPage();
      const user = userEvent.setup();

      const homeButton = screen.getByRole("button", { name: "商品一覧に戻る" });
      await user.click(homeButton);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  describe("ナビゲーション機能", () => {
    it("一覧に戻るリンクが正しく機能する", () => {
      (useEquipmentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockEquipment,
        isLoading: false,
        isError: false,
        error: null
      });

      renderDetailPage();

      const backLink = screen.getByRole("link", { name: "一覧に戻る" });
      expect(backLink).toHaveAttribute("href", "/");
    });

    it("編集リンクが正しいパスを持つ", () => {
      (useEquipmentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockEquipment,
        isLoading: false,
        isError: false,
        error: null
      });

      renderDetailPage();

      const editLink = screen.getByRole("link", { name: "編集する" });
      expect(editLink).toHaveAttribute("href", "/edit/001");
    });
  });

  describe("グローバルストアとの連携", () => {
    it("データ取得成功時にストアの関数が呼ばれる", async () => {
      (useEquipmentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockEquipment,
        isLoading: false,
        isError: false,
        error: null
      });

      renderDetailPage();

      // useEffectの実行を待つ
      await waitFor(() => {
        expect(mockSelectEquipment).toHaveBeenCalledWith(mockEquipment);
        expect(mockAddToRecentlyViewed).toHaveBeenCalledWith("001");
      });
    });

    it("コンポーネントのアンマウント時にselectEquipmentがnullで呼ばれる", async () => {
      (useEquipmentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockEquipment,
        isLoading: false,
        isError: false,
        error: null
      });

      const { unmount } = renderDetailPage();

      // アンマウント
      unmount();

      // クリーンアップ関数の実行を確認
      await waitFor(() => {
        expect(mockSelectEquipment).toHaveBeenLastCalledWith(null);
      });
    });
  });

  describe("ステータス表示のスタイリング", () => {
    it.each([
      { status: "利用可能", expectedClass: "bg-green-100" },
      { status: "使用中", expectedClass: "bg-blue-100" },
      { status: "貸出中", expectedClass: "bg-yellow-100" },
      { status: "廃棄", expectedClass: "bg-gray-100" }
    ])(
      "$status のステータスが正しいスタイルで表示される",
      ({ status, expectedClass }) => {
        const equipmentWithStatus = {
          ...mockEquipment,
          status: status as Equipment["status"]
        };

        (useEquipmentById as ReturnType<typeof vi.fn>).mockReturnValue({
          data: equipmentWithStatus,
          isLoading: false,
          isError: false,
          error: null
        });

        renderDetailPage();

        const statusElement = screen.getByText(status);
        expect(statusElement.className).toContain(expectedClass);
      }
    );
  });

  describe("URLパラメータの処理", () => {
    it("正しいIDでデータ取得関数が呼ばれる", () => {
      (useEquipmentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: mockEquipment,
        isLoading: false,
        isError: false,
        error: null
      });

      renderDetailPage("123");

      expect(useEquipmentById).toHaveBeenCalledWith("123");
    });

    it("IDがない場合は空文字列で取得関数が呼ばれる", () => {
      (useEquipmentById as ReturnType<typeof vi.fn>).mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null
      });

      render(
        <MemoryRouter initialEntries={["/detail/"]}>
          <Routes>
            <Route path="/detail/" element={<DetailPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(useEquipmentById).toHaveBeenCalledWith("");
    });
  });
});
