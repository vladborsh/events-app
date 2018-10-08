import { UserModel } from '../models/user.model';

export interface AppState {
    readonly user: UserModel;
}
