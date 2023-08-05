<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Facades\Image as ResizeImage;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id)
    {
        $images = Image::where('patient_id', $id)->get();
        return response()->json(['message' => 'Амжилттай', 'images' => $images]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $path = public_path("images/$id");
        !is_dir($path) &&
            mkdir($path, 0777, true);
        $name = date('Y-m-d H:i:s') . '.' . $request->image->extension();
        $request->image->storeAs('public/images/' . $id, $name);

        // ResizeImage::make($request->file('image'))
        //     // ->resize(100, 100)
        //     ->save($path . '/' . $name);

        $image = new Image();
        $image->path = $name;
        $image->patient_id = $id;
        $image->save();
        return response()->json(['message' => 'Амжилттай хадгалагдлаа', 'image' => $image]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Image $image)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Image $image)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Image $image)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $image = Image::find($id);
        if (!$image) {
            return response()->json(['message' => 'Зураг олдсонгүй', 'image' => null]);
        }
        if (File::exists(public_path("images/$image->patient_id/$image->path"))) {
            File::delete(public_path("images/$image->patient_id/$image->path"));
        }
        $image->delete();
        return response()->json(['message' => 'Зураг устлаа', 'image' => $id]);
    }
}
