<?php

namespace App\Http\Controllers;

use App\Models\Blank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BlankController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $blanks = Blank::get();
        return response()->json($blanks);
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
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'content' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $blank = Blank::create($request->all());
        if ($blank) {
            return response()->json(['message' => 'Загвар нэмэгдлээ', 'blank' => $blank]);
        } else {
            return response()->json(['message' => 'Алдаа гарлаа', 'blank' => null], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Blank $blank)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Blank $blank)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $blank = Blank::find($id);

        if ($blank) {
            $blank->fill($request->all());
            $blank->save();
            return response()->json(['message' => 'Загвар хадгалагдлаа', 'blank' => $blank], 200);
        } else {
            return response()->json(['message' => 'Загвар байхгүй байна'], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $blank = Blank::find($id);

        if ($blank) {
            $blank->delete();
            return response()->json(['message' => 'Загвар устгагдлаа'], 200);
        } else {
            return response()->json(['message' => 'Загвар байхгүй байна'], 404);
        }
    }
}
