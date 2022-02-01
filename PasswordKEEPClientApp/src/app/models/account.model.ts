import { FormatDate, PrimaryKey } from "../decorators/property.decorator";

export class Account{
    @PrimaryKey()
    public id: string | null = null;
    public username: string | null = null;
    public password: string | null = null;
    public lastModified: Date | null = null;
}