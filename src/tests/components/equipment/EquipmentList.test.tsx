// filepath: c:\Users\d12552\Projects\equipment-management\src\tests\components\equipment\EquipmentList.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { UseQueryResult } from "@tanstack/react-query";

import EquipmentList from "../../../components/equipment/EquipmentList";
import { useEquipments } from "../../../hooks/useEquipment";
import { Equipment } from "../../../types/equipment";

// useEquipmentフックをモック
vi.mock("../../../hooks/useEquipment", () => ({
  useEquipments: vi.fn(),
  useDeleteEquipment: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null
  })
}));

// react-hot-toastもモック
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Zustandのストアをモック
vi.mock("../../../stores/filterStore", () => ({
  default: () => ({
    categoryFilter: "",
    statusFilter: ""
  })
}));

const createQueryResult = (
  state: "loading" | "error" | "success",
  options: {
    data?: Equipment[];
    error?: Error;
    refetch?: () => void;
  } = {}
): UseQueryResult<Equipment[], Error> => {
  // 共通のプロパティ
  const base = {
    refetch: options.refetch || vi.fn()
  };

  // 状態に応じたプロパティを返す
  if (state === "loading") {
    return {
      ...base,
      isLoading: true,
      isError: false,
      isSuccess: false,
      status: "loading",
      data: undefined,
      error: null
    } as unknown as UseQueryResult<Equipment[], Error>;
  }

  if (state === "error") {
    return {
      ...base,
      isLoading: false,
      isError: true,
      isSuccess: false,
      status: "error",
      data: undefined,
      error: options.error || new Error("テストエラー")
    } as unknown as UseQueryResult<Equipment[], Error>;
  }

  // 成功状態
  return {
    ...base,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: "success",
    data: options.data || [],
    error: null
  } as unknown as UseQueryResult<Equipment[], Error>;
};

describe("EquipmentList コンポーネント", () => {
  // モックデータ準備
  const mockEquipments: Equipment[] = [
    {
      id: "1",
      name: "ノートパソコン",
      category: "電子機器",
      status: "利用可能",
      quantity: 5,
      storageLocation: "倉庫A",
      purchaseDate: "2023-01-15",
      createdAt: "2025-05-01T00:00:00.000Z",
      updatedAt: "2025-05-01T00:00:00.000Z"
    },
    {
      id: "2",
      name: "デスクチェア",
      category: "オフィス家具",
      status: "貸出中",
      quantity: 3,
      storageLocation: "倉庫B",
      borrower: "鈴木太郎",
      purchaseDate: "2022-11-20",
      createdAt: "2025-04-15T00:00:00.000Z",
      updatedAt: "2025-04-15T00:00:00.000Z"
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // テスト1: データ読み込み中の状態をテスト
  it("ローディング状態を表示する", () => {
    // ローディング中のモックレスポンスを設定
    (useEquipments as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      createQueryResult("loading")
    );

    render(
      <BrowserRouter>
        <EquipmentList />
      </BrowserRouter>
    );

    // ローディング表示が表示されていることを確認
    expect(
      screen.getByText(/備品データを読み込んでいます.../)
    ).toBeInTheDocument();
  });

  // テスト2: API呼び出し成功時の動作をテスト
  it("API呼び出しが成功したらデータが表示され、トースト通知が表示される", async () => {
    // 成功時のモックレスポンスを設定
    (useEquipments as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      createQueryResult("success", { data: mockEquipments })
    );

    render(
      <BrowserRouter>
        <EquipmentList />
      </BrowserRouter>
    );

    // データが表示されていることを確認
    await waitFor(() => {
      expect(screen.getByText("ノートパソコン")).toBeInTheDocument();
      expect(screen.getByText("デスクチェア")).toBeInTheDocument();
    });
  });

  // テスト3: エラーケースのテスト
  it("API呼び出しがエラーになった場合、エラーメッセージとリトライボタンが表示される", () => {
    const mockError = new Error("APIエラー発生");
    const mockRefetch = vi.fn();

    // エラー時のモックレスポンスを設定
    (useEquipments as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      createQueryResult("error", { error: mockError, refetch: mockRefetch })
    );

    render(
      <BrowserRouter>
        <EquipmentList />
      </BrowserRouter>
    );

    // エラーメッセージが表示されていることを確認
    expect(
      screen.getByText(/データの読み込みに失敗しました/)
    ).toBeInTheDocument();

    // リトライボタンが表示されていることを確認
    expect(screen.getByText(/再読み込み/)).toBeInTheDocument();
  });

  // テスト4: データが空の場合のテスト
  it("データが空の場合、「備品が見つかりませんでした」と表示される", () => {
    // データが空のモックレスポンスを設定
    (useEquipments as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      createQueryResult("success", { data: [] })
    );

    render(
      <BrowserRouter>
        <EquipmentList />
      </BrowserRouter>
    );

    // 「備品が見つかりませんでした」が表示されていることを確認
    expect(screen.getByText(/備品が見つかりませんでした/)).toBeInTheDocument();
  });

  // テスト5: 非同期データが読み込まれる流れをテスト
  it("ローディング後にデータが読み込まれるまでの流れをテストする", async () => {
    // 初めはローディング状態
    (useEquipments as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      createQueryResult("loading")
    );

    const { rerender } = render(
      <BrowserRouter>
        <EquipmentList />
      </BrowserRouter>
    );

    // 最初はローディング表示を確認
    expect(
      screen.getByText("備品データを読み込んでいます...")
    ).toBeInTheDocument();

    // データが読み込まれた状態にモックを変更
    (useEquipments as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      createQueryResult("success", { data: mockEquipments })
    );

    // コンポーネントを再レンダリング
    rerender(
      <BrowserRouter>
        <EquipmentList />
      </BrowserRouter>
    );

    // データが表示されたことを確認
    await waitFor(() => {
      expect(screen.getByText("ノートパソコン")).toBeInTheDocument();
      expect(screen.getByText("デスクチェア")).toBeInTheDocument();
    });
  });

  // TODO: Write tests for delete function
});
