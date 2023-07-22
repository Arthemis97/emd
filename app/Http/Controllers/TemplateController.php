<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $templates = Template::with('package')->get(['id', 'name']);
        return response()->json($templates);
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
    public function store(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'name' => 'required',
            'template' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $template = Template::create($data);
        $tmp = $template;
        if ($data['packages'] && sizeof($data['packages']) > 0) {
            $template->package()->attach($data['packages']);
        }
        $tmp->package = $template->package;
        if ($template) {
            return response()->json(['message' => 'Маягт нэмэгдлээ', 'template' => $tmp]);
        } else {
            return response()->json(['message' => 'Алдаа гарлаа', 'template' => null], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $template = Template::with('package')->findOrFail($id);
        return response()->json(['message' => 'Амжилттай', 'template' => $template]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Template $template)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $template = Template::find($id);
        $tmp = $template;
        $data = $request->all();
        if ($template) {
            $template->fill($request->all());
            $template->save();
            $template->package()->sync($data['packages']);
            $tmp->package = $template->package;
            return response()->json(['message' => 'Маягт хадгалагдлаа', 'template' => $tmp], 200);
        } else {
            return response()->json(['message' => 'Маягт байхгүй байна'], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $template = Template::find($id);

        if ($template) {
            $template->delete();
            return response()->json(['message' => 'Маягт устгагдлаа'], 200);
        } else {
            return response()->json(['message' => 'Маягт байхгүй байна'], 404);
        }
    }
}
