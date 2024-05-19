using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PawnShop.Server.Entities;
using PawnShop.Server.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PawnShop.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ItemController : ControllerBase
    {
        private readonly ItemService _itemService;

        public ItemController(ItemService itemService) =>
            _itemService = itemService;

        [HttpGet]
        public async Task<IEnumerable<Item>> Get() =>
            await _itemService.GetAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Item?>> GetById(string id)
        {
            var item = await _itemService.GetByIdAsync(id);
            return item is not null ? Ok(item) : NotFound();
        }

        [HttpGet("getItemsByCategories")]
        public async Task<IEnumerable<Item>> GetItemsByCategories([FromQuery] string categories)
        {
            var categoryList = categories.Split(',').ToList();
            return await _itemService.GetItemsByCategoriesAsync(categoryList);
        }

        [HttpGet("getAllCategories")]
        public async Task<IEnumerable<string>> GetAllCategories() =>
            await _itemService.GetAllCategoriesAsync();

        [HttpDelete("buy/{id}")]
        public async Task<IActionResult> BuyItem(string id)
        {
            var success = await _itemService.DeleteAsync(id);
            return success ? NoContent() : NotFound();
        }

        [HttpPost("sell")]
        public async Task<IActionResult> SellItem([FromForm] string itemDescription, [FromForm] double price, [FromForm] string category, [FromForm] IFormFile? image)
        {
            var item = await _itemService.CreateAsync(itemDescription, price, category, image);
            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }
    }
}
