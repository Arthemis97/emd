<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $packages = Package::get();
        return response()->json($packages);
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
            'name' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $package = Package::create($request->all());
        if ($package) {
            return response()->json(['message' => 'Багц нэмэгдлээ', 'package' => $package]);
        } else {
            return response()->json(['message' => 'Алдаа гарлаа', 'package' => null], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Package $package)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $package = Package::find($id);

        if ($package) {
            $package->fill($request->all());
            $package->save();
            return response()->json(['message' => 'Багц хадгалагдлаа', 'package' => $package], 200);
        } else {
            return response()->json(['message' => 'Багц байхгүй байна'], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $package = Package::find($id);

        if ($package) {
            $package->delete();
            return response()->json(['message' => 'Багц устгагдлаа'], 200);
        } else {
            return response()->json(['message' => 'Багц байхгүй байна'], 404);
        }
    }
}
