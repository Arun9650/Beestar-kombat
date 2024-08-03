export type IconProps = {
    size?: number;
    className?: string;
}

export interface User {
    id: string;
    userName: string;
    skin: string;
    coins: number;
    profitPerHour: number;
    lastProfitUpdate?: Date;
  }
  