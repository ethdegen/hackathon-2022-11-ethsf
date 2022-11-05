from domain.notion.client import NotionClient

notion = NotionClient(
    "secret_ThyBFJOGvfg9verCNa3So5dK3e8eGeZ5030j05XsWjn",
    "1bd18ec17cf84683bc2eb71c4fb233d7",
    "0ed9a0d3c83f4b6abf23c87cfa26ed0c",
)

page_id = "de32e778309648648c27fef0e74e3d4a"

urls = notion.getURL(page_id, True)

