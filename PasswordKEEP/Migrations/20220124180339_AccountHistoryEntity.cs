using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace PasswordKEEP.Migrations
{
    public partial class AccountHistoryEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2fa0a954-1ace-49e5-95f7-0f9ca7bbd4bb");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f558cffb-23a3-4628-8e2c-bbd2c30dd0e1");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModified",
                table: "Accounts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "AccountHistory",
                columns: table => new
                {
                    AccountHistoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AccountId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VersionFrom = table.Column<DateTime>(type: "datetime2", nullable: false),
                    VersionTo = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccountHistory", x => new { x.AccountHistoryId, x.AccountId });
                    table.ForeignKey(
                        name: "FK_AccountHistory_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "AccountId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "8f341483-2346-4232-b476-13612cde641b", "e0f4ff24-cade-4f09-9f77-7d0051e1fbaa", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "102e2743-9739-454c-a9dc-8bd9b9206cb9", "4eb6daf2-d124-4518-b8ee-69f550bf9dc0", "User", "USER" });

            migrationBuilder.CreateIndex(
                name: "IX_AccountHistory_AccountId",
                table: "AccountHistory",
                column: "AccountId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AccountHistory");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "102e2743-9739-454c-a9dc-8bd9b9206cb9");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8f341483-2346-4232-b476-13612cde641b");

            migrationBuilder.DropColumn(
                name: "LastModified",
                table: "Accounts");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "2fa0a954-1ace-49e5-95f7-0f9ca7bbd4bb", "cfa26fd6-272f-48d4-87fc-0a87e757acd2", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "f558cffb-23a3-4628-8e2c-bbd2c30dd0e1", "1e71ca02-e54a-4d13-aea6-58b60ffe0620", "User", "USER" });
        }
    }
}
