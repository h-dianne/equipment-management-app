import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  fetchEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment
} from "../api/equipmentApi";
import { Equipment } from "../types/equipment";

// 定義: 備品データのキャッシュキー
export const equipmentKeys = {
  all: ["equipments"] as const,
  details: (id: string) => [...equipmentKeys.all, id] as const
};

// 備品データを取得するクエリフック
export const useEquipments = () => {
  return useQuery({
    queryKey: equipmentKeys.all,
    queryFn: fetchEquipment
  });
};

// キャッシュを明示的に無効化するフック
export const useInvalidateEquipments = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
  };
};

// 備品データを手動で再取得するフック
export const useRefetchEquipments = () => {
  const queryClient = useQueryClient();

  return () => {
    return queryClient.refetchQueries({ queryKey: equipmentKeys.all });
  };
};

// 備品を追加するミューテーションフック
export const useCreateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEquipment,
    onSuccess: () => {
      // 成功時にキャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
    }
  });
};

// 備品を更新するミューテーションフック
export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      id: string;
      data: Partial<Omit<Equipment, "id" | "createdAt" | "updatedAt">>;
    }) => updateEquipment(params.id, params.data),
    onSuccess: (data) => {
      // 成功時に特定の備品と全体のリストを更新
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.details(data.id)
      });
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
    }
  });
};

// 備品を削除するミューテーションフック
export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEquipment,
    onSuccess: (_, variables) => {
      // 成功時にキャッシュから削除した備品を除去
      queryClient.removeQueries({ queryKey: equipmentKeys.details(variables) });
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all });
    }
  });
};
